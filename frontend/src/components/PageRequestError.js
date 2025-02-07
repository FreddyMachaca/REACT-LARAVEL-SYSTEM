import PageNotFound from 'pages/errors/PageNotFound';
import Forbidden from 'pages/errors/Forbidden';
import ServerError from 'pages/errors/ServerError';
const PageRequestError = (props) => {
	const error = props.error;
	const { status = 500, data = "Unable to process request." } = error.response;
	if(status === 404){
		return <PageNotFound message={data} />
	}
	else if(status === 403){
		return <Forbidden message={data} />
	}
	return (
		<ServerError message={data} />
	)
}
export { PageRequestError }