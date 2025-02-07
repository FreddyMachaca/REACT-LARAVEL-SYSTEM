import { useState } from "react";
import { useFormik } from 'formik';
import { useMutation} from 'react-query';

import useApi from 'hooks/useApi';

const usePostForm = ({ formUrl, formData, validationSchema, afterSubmit }) => {
	const api = useApi();
	const [errorMsg, setErrorMsg] = useState(null);
	const [data, setData] = useState(null);

	function saveFormData(postData) {
		return api.post(formUrl, postData).then((res) => res.data);
	}

	const mutation = useMutation(saveFormData, {
		retry: false, 
		onSuccess: (data) => {
			setData(data);
			if(typeof afterSubmit === 'function'){
				afterSubmit(data);
			}
		},
		onError: (error) => {
			const errMsg = error?.response?.data || "Unable to send request";
			setErrorMsg(errMsg);
		},
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: formData,
		validationSchema: validationSchema,
		onSubmit: async (validatedFormData) => {
			setErrorMsg(null);
			mutation.mutate(validatedFormData);
		}
	});

	const isFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
	const getFieldError = (name) => {
		return isFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
	};

	const getErrorClass = (name) => {
		return { 'p-invalid': isFieldValid(name) }
	};

	const vals = {
		data,
		loading: mutation.isLoading,
		errorMsg,
		setErrorMsg,
		isFieldValid,
		getFieldError,
		getErrorClass,
		formik
	}
	return vals;
}

export default usePostForm