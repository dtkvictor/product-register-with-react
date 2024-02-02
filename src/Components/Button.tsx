export interface ButtonInterface {
    type?: "primary" | "secundary" | "success" | "danger" | "dark" | "warning" | "rose" | "generic",
    children?: string | number | React.ReactElement | React.ReactElement[],
    className?: string,
    onClick?: React.MouseEventHandler,  
}

type ButtonProps = ButtonInterface;

function setTypeButton(type: null|undefined|ButtonProps['type']):string {
    const types = {
        primary: 'bg-blue-500 hover:bg-blue-400 text-white',
        secundary: 'bg-neutral-300 hover:bg-neutral-200',
        success: 'bg-emerald-500 hover:bg-emerald-400 text-white',
        danger: 'bg-red-500 hover:bg-red-400 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-400 text-white',
        rose: 'bg-rose-400 hover:bg-rose-300 text-white',
        dark: 'bg-neutral-800 hover:bg-neutral-600 text-white',
        generic: 'bg-white hover:bg-neutral-100',
    }
    if(type && types[type]) {
        return types[type]
    } 
    return '';
}

export default function Button({type, children, className, onClick }: ButtonProps): React.ReactElement 
{
    function onClickHandler(event: React.MouseEvent) {
        if(onClick) onClick(event);
    }

    return (
        <button 
            onClick={ onClickHandler }     
            className={`flex justify-center items-center shadow shadow-neutral-400 rounded active:scale-75 ${setTypeButton(type)} ${className}`}           
        > 
            { children }
        </button>
    );
}