import React, { useState, useEffect } from 'react';
import useApi from 'hooks/useApi';
import useUtils from 'hooks/useUtils';
import { AutoComplete } from 'primereact/autocomplete';

const AutoCompleteSelect = (props) => {
	const utils = useUtils();
	const api = useApi();
	const [response, setResponse] = useState([]);
	const [error, setError] = useState(null);
	const [selected, setSelected] = useState(props.value);

	const fetchData = async (event) => {
		if (props.apiPath) {
			try {
				setError(false);
				let search = event?.query.trim();
				if (search) {
					let qs = utils.serializeQuery({ search });
					let url = props.apiPath + "?" + qs;
					const response = await api.get(url);
					setResponse(response.data);
				}
				else {
					setResponse([]);
					setSelected(props.value);
				}
			}
			catch (err) {
				setError(err);
			}
		}
	}
	function updateValue(obj) {
		setSelected(obj);
		if (obj?.value) {
			props.onChange(obj.value);
		} else {
			props.onChange(obj);
		}
	}
	return <AutoComplete forceSelection dropdown={props.dropdown} multiple={props.multiple} dropdownMode="current" value={selected} suggestions={response} completeMethod={fetchData} onChange={(e) => updateValue(e.value)} field="label" className={props.className} />
}

AutoCompleteSelect.defaultProps = {
	dropdown: true,
	multiple: false,
	className: 'w-full',
	onChange: () => { },
}
export { AutoCompleteSelect };
