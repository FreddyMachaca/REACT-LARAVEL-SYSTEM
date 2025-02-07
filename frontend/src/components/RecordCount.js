import { DataSource } from 'components/DataSource';
import { Knob } from 'primereact/knob';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { Link } from 'react-router-dom';

const RecordCount = (props) => {
    const { apiPath, hasProgressView, link, title, description, icon, valuePrefix, valueSuffix, cardClass, avatarClass, minValue, maxValue } = props;
    return (
        <DataSource apiPath={apiPath} showLoading={false}>
            {
                ({ response, loading, error }) => {
                    let displayValueTemplate
                    if (loading) {
                        displayValueTemplate = (<ProgressSpinner style={{ width: '30px', height: '30px' }} />)
                    }
                    else if (hasProgressView) {
                        let value = parseFloat(response);
                        let valueTemplate = `${valuePrefix}{value}${valueSuffix}`
                        displayValueTemplate = (<div className="text-center"><Knob readOnly valueColor={"accent"} rangeColor={"SlateGray"} min={minValue} max={maxValue} value={value} valueTemplate={valueTemplate} /></div>)
                    }
                    else {
                        displayValueTemplate = (<div className="p-3"><Chip label={`${valuePrefix}${response}${valueSuffix}`} className="font-bold text-2xl" /></div>)
                    }

                    return (
                        <Link to={link}>
                            <div className={`card ${cardClass}`}>
                                <div className="flex align-items-center justify-content-between">
                                    <div className="flex-grow-1">
                                        {title && <div className="text-xl font-bold">{title}</div>}

                                        {displayValueTemplate}


                                    </div>
                                    {icon && <div style={{ width: 'auto' }}>
                                        <Avatar icon={icon} size="xlarge" className={avatarClass} />
                                    </div>}
                                </div>
                                {description && <div className="">{description}</div>}
                            </div>
                        </Link>
                    )
                }
            }
        </DataSource>
    )
}

RecordCount.defaultProps = {
    apiPath: '',
    hasProgressView: false,
    link: '',
    title: '',
    description: '',
    icon: '',
    valuePrefix: '',
    valueSuffix: '',
    cardClass: '',
    avatarClass: 'bg-gray-200 text-primary',
    minValue: 0,
    maxValue: 100
}
export { RecordCount }