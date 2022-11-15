type ValueType = {
    label: string
    value: number
}
export default function DynodeMeta(props: {
    title: string
    left: ValueType
    right: ValueType
    toFixed?: number
}){
    const left = props.left
    const right = props.right
    const toFixed = props.toFixed ? props.toFixed : 2
    return (
        <div className='dynode-meta'>
            <div className='dm-title'>{ props.title }</div>
            <div className='dm-values'>
                <div className='dm-item'>{left.label}: <span className='dmv'>{left.value.toFixed(toFixed)}px</span></div>
                <div className='dm-item'>{right.label}: <span className='dmv'>{right.value.toFixed(toFixed)}px</span></div>
            </div>
        </div>
    )
}