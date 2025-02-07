import { useEffect, useState, useMemo } from "react";
import { useParams } from 'react-router-dom';
import useApp from 'hooks/useApp';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import useApi from 'hooks/useApi';
import { confirmDialog } from 'primereact/confirmdialog';
const useEditPage = ({ props, formDefaultValues, afterSubmit }) => {
	const app = useApp();
	const api = useApi();
	const { pageid } = useParams(); // record id from url param e.g products/edit/23
	const [currentRecord, setCurrentRecord] = useState(null);
	const [formData, setFormData] = useState(formDefaultValues);
	const [pageReady, setPageReady] = useState(false);
	let recID = props.id || pageid;
	recID = recID || '';
	const url = `${props.apiPath}/${recID}`; // set api url e.g products/edit/23
	const { isLoading, isError, data, error } = useQuery([props.pageName, url], () => fetchFormData(), { retry: false, });
	useEffect(() => {
		if (data) {
			const formValues = mapToFormData(data);
			setFormData(formValues);
			setCurrentRecord(data);
			setPageReady(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isError]);
	function fetchFormData() {
		return api.get(url).then((res) => res?.data);
	}
	function submitFormData(formValues) {
		const postData = normalizeFormData(formValues);
		return api.post(url, postData).then((res) => res?.data);
	}
	const queryClient = useQueryClient();
	const mutation = useMutation(submitFormData, {
		retry: false,
		onSuccess: (data) => {
			queryClient.invalidateQueries(props.pageName);
			if (afterSubmit) {
				afterSubmit(data);
			}
		},
		onError: (error) => {
			app.showPageRequestError(error);
		},
	});
	function normalizeFormData(formValues) {
		if (typeof formValues === 'string') {
			return formValues;
		}
		if (Array.isArray(formValues)) {
			return formValues.map(form => normalizeFormData(form));
		}
		if (typeof formValues === 'object') {
			const postData = { ...formValues }
			Object.keys(postData).forEach(function (key) {
				const fieldValue = postData[key];
				if (Array.isArray(fieldValue)) {
					if(fieldValue.every(item => typeof item === "string")){
						postData[key] = fieldValue.toString();
					}
					else{
						postData[key] = normalizeFormData(fieldValue);
					}
				}
				else if (fieldValue instanceof Date) {
					postData[key] = fieldValue.toISOString().slice(0, 19).replace('T', ' ');
				}
				else if (fieldValue === '') {
					postData[key] = null;
				}
			});
			return postData;
		}
		return formValues
	}
	function mapToFormData(apiData) {
		const formValues = { ...apiData }
		Object.keys(formValues).forEach(function (key) {
			const fieldValue = formValues[key];
			const fieldDefaultValue = formDefaultValues[key];
			if (Array.isArray(fieldDefaultValue)) {
				if (fieldValue) {
					formValues[key] = fieldValue.toString().split(",");
				}
				else {
					formValues[key] = fieldDefaultValue
				}
			}
			else if (fieldDefaultValue instanceof Date  && fieldValue) {
				formValues[key] = new Date(fieldValue);
			}
		});
		return formValues;
	}
	function handleSubmit(e, formik) {
		if (!formik.isValid) {
			app.flashMsg(props.formValidationError, props.formValidationMsg, "error");
		}
	}
	function submitForm(validatedFormData) {
		let confirmMsg = props.msgBeforeSave;
		if (confirmMsg) {
			confirmDialog({
				header: props.msgTitle,
				message: confirmMsg,
				icon: 'pi pi-save',
				accept: async () => {
					mutation.mutate(validatedFormData);
				},
				reject: () => {
					//callback to execute when user rejects the action
				}
			});
		}
		else {
			mutation.mutate(validatedFormData);
		}
	}
	function inputClassName(hasError, className = 'w-full') {
		if (hasError) {
			return `${className} p-invalid`;
		}
		return className;
	}
	const pageData = {
		currentRecord,
		formData,
		inputClassName,
		setFormData,
		handleSubmit,
		submitForm,
		setCurrentRecord,
		pageReady,
		saving: mutation.isLoading,
		loading: isLoading,
		apiRequestError: error
	}
	return useMemo(() => pageData,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[formData, currentRecord, pageReady, mutation.isLoading, isLoading, error]
	);
}
export default useEditPage;