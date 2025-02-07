import React, { useState, useEffect } from "react";

import useUtils from 'hooks/useUtils';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';
import { DataSource } from 'components/DataSource';
const PageSearch = (props) => {
	const utils = useUtils();
	const [pagination, setPagination] = useState({
		firstRow: 0,
		limit: 10,
		page: 1,
	});


	const [showResult, setShowResult] = useState(false);
	const [records, setRecords] = useState([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [searchText, setSearchText] = useState('');
	const [searchDebounceValue, setSearchDebounceValue] = useState('');
	const [searchUrl, setSearchUrl] = useState('');

	function getSearchQueryPath() {
		if (searchDebounceValue) {
			let query = {
				page: pagination.page,
				limit: pagination.limit,
				search: searchDebounceValue
			};
			let qs = utils.serializeQuery(query);
			return `/${props.searchPage}?${qs}`;
		}
		return null;
	}
	const searchApiPath = getSearchQueryPath();

	useEffect(() => {
		setSearchUrl(searchApiPath)
	}, [searchApiPath]);

	useEffect(() => {
		toggleSearchBox();
		const delayDebounceFn = setTimeout(() => {
			if (searchText) {
				const pager = { ...pagination }
				pager.page = 1;
				setPagination(pager);
			}
			setSearchDebounceValue(searchText);
		}, 400);
		return () => clearTimeout(delayDebounceFn)
	}, [searchText]);

	function recordsPosition() {
		return Math.min(pagination.page * pagination.limit, totalRecords);
	}

	function totalPages() {
		if (totalRecords > pagination.limit) {
			return Math.ceil(totalRecords / pagination.limit);
		}
		return 1;
	}

	function searchCompleted(response) {
		if (response.records) {
			setRecords(response.records);
			setTotalRecords(response.totalRecords);
		}
		else {
			setRecords([])
			setTotalRecords(0);
		}
	}
	function toggleSearchBox() {
		if (searchText) {
			setShowResult(true);
		}
		else {
			setShowResult(false);
		}
	}

	function onPageChange(e) {
		const pager = {
			firstRow: e.first,
			page: e.page + 1,
			limit: e.rows,
		}
		setPagination(pager);
	}

	return (
		<div style={{ position: 'relative' }} className="">
			<DataSource showLoading={false} apiPath={searchUrl} onLoad={(response) => searchCompleted(response)}>
				{
					({ loading, error }) =>
						<>
							<div className="p-input-icon-left w-full">
								<i className={props.icon} />
								<InputText onFocus={() => toggleSearchBox()} placeholder={props.placeholder} value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full" />
							</div>
							{
								showResult &&
								<div className={classNames('search-result-holder', props.menuClassName)}>

									<div className="flex justify-content-between surface-100 p-3 mb-3">
										<div className="">
											<div className="font-bold">Search Result</div>
											{
												//search result count
												totalRecords > 0 &&
												<small className="text-500">Showing record {recordsPosition()} of {totalRecords} </small>
											}
										</div>

										<div>
											<Button onClick={() => setShowResult(false)} className="p-button-text p-button-sm p-button-danger" icon="pi pi-times" />
										</div>
									</div>

									{
										//show loading
										loading ?
											<div className="text-center">
												<ProgressSpinner style={{ width: '30px', height: '30px' }} />
											</div> :
											//search result loaded
											<div className="result-list">
												{
													records.map((data, index) =>
														<div key={`item-${index}`}>{props.children(data)}</div>)
												}
											</div>
									}

									{
										//empty search result
										(searchText && !records.length && !loading) &&
										<div className="text-center text-gray-500 p-3">{props.emptySearchMsg}</div>
									}

									{
										//show pagination control
										totalPages() > 1 &&
										<div className="p-2">
											<Paginator first={pagination.firstRow} onPageChange={(event) => onPageChange(event)} rows={pagination.limit} totalRecords={totalRecords} template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink">
											</Paginator>
										</div>
									}
								</div>
							}
						</>
				}
			</DataSource>
		</div>
	);
}


PageSearch.defaultProps = {
	searchPage: '',
	menuClass: '',
	icon: '',
	autoClose: '',
}
export { PageSearch }