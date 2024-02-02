interface AlertInterface {
    type: 'success' | 'danger' | 'warning' | 'info',
    message: string|null|undefined
}

export default function Alert({type, message}:AlertInterface): React.ReactElement
{
    if(!message) return <></>;

    const types = {
        success: 'bg-green-400 ',
        danger: 'bg-red-400',
        warning: 'bg-yellow-400',
        info: 'bg-blue-400' 
    }
    const css = `${(types[type] ?? '')} text-white rounded shadow p-3 mb-3`;

    return <div className={css}>{ message }</div>;
}