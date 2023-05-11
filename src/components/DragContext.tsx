import {
    DndContext, KeyboardSensor, closestCenter,
    useSensor, useSensors, PointerSensor
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement, restrictToWindowEdges } from '@dnd-kit/modifiers';
import Droppable from './Droppable';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { baseProps, optionProps } from '@/assets/utils/formConfig/editorConfig';

interface propsTypes {
    list: Array<baseProps | optionProps>,
    dragChangeCallback?: Function,
    deleteOptionCallBack?: Function,
    idKey?: string,
    item?: baseProps,
    dragClassName?: string,
    [key: string]: any
}

const boundType = {
    window: restrictToWindowEdges,
    parent: restrictToParentElement
}


/* 拖拽的内容显示区域 */
const DragContext = (Component: any) => {
    /* 高阶组件 */
    return (props: propsTypes) => {

        const { list, dragChangeCallback, deleteOptionCallBack, idKey, dragClassName, item, bound, modal } = props;

        // 设置列表项的id取值
        const id: string = idKey || 'id';
        // 指定传感器，默认是全部
        const sensors = useSensors(
            // MouseSensor
            useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // 距离小于8不响应拖拽
            useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
            })
        );
        /* 拖拽结束 */
        const onDragEnd = ({ active, over }: DragEndEvent) => {
            if (active.id !== over?.id) {
                const oldIndex = list.findIndex(i => i[id as keyof typeof i] === active.id);
                const newIndex = list.findIndex(i => i[id as keyof typeof i] === over?.id);
                dragChangeCallback && dragChangeCallback(arrayMove(list, oldIndex, newIndex));
            }
        };

        const DroppableConetnt = Droppable(Component);


        /* 
        @dnd-kit/core 文件包
        该属性优先于 modifiers，但是关闭之后就看 modifiers 设置了
        // collisionDetection 设置拖动中碰撞算法 
            rectIntersection 默认
            pointerWithin 点击拖动算法
            closestCenter 关闭算法
            还可以自定义碰撞算法

        @dnd-kit/core 文件包
        // sensors 传感器 用户拖拽时候的操作方式

        @dnd-kit/modifiers 文件包
        // modifiers拖动中的属性配置
            restrictToHorizontalAxis x轴可拖动
            restrictToVerticalAxis y轴可拖动
            restrictToParentElement 拖动边界为父元素
            restrictToFirstScrollableAncestor 拖动边界为第一个可滚动祖元素
            restrictToWindowEdges 拖动边界为屏幕

        @dnd-kit/sortable 文件包
        // strategy 设置排序的方式
            rectSortingStrategy 默认值，已经适用于大多数情况，但是不支持虚拟列表
            verticalListSortingStrategy 垂直列表，支持虚拟列表
            horizontalListSortingStrategy 水平列表，支持虚拟列表
            rectSwappingStrategy 实现可交换的功能
        */
        return (
            <DndContext
                collisionDetection={closestCenter}
                sensors={sensors}
                onDragEnd={onDragEnd}
                modifiers={[restrictToVerticalAxis, bound ? boundType[bound as keyof typeof boundType] : restrictToWindowEdges]}
            >
                <SortableContext
                    // rowKey array
                    items={list.map(i => i[id as keyof typeof i])}
                    strategy={verticalListSortingStrategy}
                >
                    {list.map((dragItem, idx) => (
                        <DroppableConetnt
                            key={dragItem[id as keyof typeof dragItem]}
                            id={dragItem[id as keyof typeof dragItem]}
                            // 当前项的数据
                            item={item ? item : (dragItem as baseProps)}
                            // 拖拽元素的数据
                            dragItem={dragItem}
                            index={idx}
                            dragClassName={dragClassName}
                            deleteOptionCallBack={deleteOptionCallBack}
                            modal={modal}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        );
    }
};

export default DragContext;