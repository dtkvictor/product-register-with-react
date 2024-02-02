import { useEffect, useRef } from "react";

type OverlayProps = {
    children: React.ReactElement,
    className?: String,
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

function Overlay({ children, className, onClick }: OverlayProps): React.ReactElement 
{
    const overlayRef = useRef<HTMLDivElement>(null)

    function onClickHandler(event: React.MouseEvent<HTMLDivElement>): void {
        if(!onClick) return;
        const children = overlayRef.current?.children[0] as HTMLElement;
        const wasClickedChildren = children && children.contains(event.target as Node);
        if(!wasClickedChildren) onClick(event);
    }        

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, [])

    return (
        <div 
            className={`bg-neutral-500/50 w-full h-full fixed right-0 top-0 ${className}`}          
            ref={overlayRef}
            onClick={onClickHandler}
        >
            { children }            
        </div>
    );
}

export default Overlay;