import { useState, useMemo } from "react";
import useApp from 'hooks/useApp';
import { useQueryClient, useMutation } from 'react-query';
import useApi from 'hooks/useApi';
import { confirmDialog } from 'primereact/confirmdialog';
const useAddPage = ({ props, formDefaultValues, afterSubmit }) => {
	const app = useApp();
	const api = useApi();
	const [pageReady] = useState(true);
	const contextFormData = app.getPageFormData(props.pageName); 
	const propsFormData = props.formData;
	const computedFormData = { ...formDefaultValues, ...propsFormData, ...contextFormData };
	const [formData, setFormData] = useState(computedFormData);
	const queryClient = useQueryClient();
	const mutation = useMutation(saveFormData, {
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
	function resetForm() {
		setFormData(computedFormData);
	}
	function handleSubmit(e, formik) {
		if (!formik.isValid) {
			app.flashMsg(props.formValidationError, props.formValidationMsg, "error");
		}
	}
	function saveFormData(formValues) {
		const url = props.apiPath;
		let postData;
		if (Array.isArray(formValues)) {
			postData = formValues.map(form => normalizeFormData(form));
		}
		else {
			postData = normalizeFormData(formValues)
		}
		return api.post(url, postData).then((res) => res?.data);
	}
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
		setFormData,
		submitForm,
		inputClassName,
		resetForm,
		handleSubmit,
		formData,
		pageReady,
		saving: mutation.isLoading,
	}
	return useMemo(() => pageData,
		[formData, pageReady, mutation.isLoading]
	);
}
export default useAddPage