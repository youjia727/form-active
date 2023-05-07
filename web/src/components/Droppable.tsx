import { baseProps, optionProps } from '@/assets/utils/formConfig/editorConfig';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface propsTypes {
    id: string,
    item?: baseProps,
    dragItem: baseProps|optionProps,
    index: number,
    dragClassName?: string //自定义拖拽中的区域类名
    [key: string]: any
}

/* 可拖拽区域的组件属性实例化 */
const DragArea = (Component: any) => {
    /* 高阶组件 */
    return (props: propsTypes) => {

        const { id, dragClassName } = props;

        const {
            attributes,
            listeners,
            setNodeRef,
            setActivatorNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id });

        const style: React.CSSProperties = {
            transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
                /translate3d\(([^,]+),/,
                'translate3d(0,',
            ),
            transition,
            ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
        };

        return (
            <div ref={setNodeRef} style={style} {...attributes} className={`draggable-item ${isDragging ? dragClassName : ''}`}>
                <Component {...props} listeners={listeners} move={setActivatorNodeRef} />
            </div>
        );
    }
};



export default DragArea;