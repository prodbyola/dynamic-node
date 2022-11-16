type ValueType = {
    label: string
    value: number
}
export default function DynodeMeta(props: {
    title: string
    left: ValueType
    right: ValueType
}){
    const left = props.left
    const right = props.right
    return (
        <div className='dynode-meta'>
            <div className='dm-title'>{ props.title }</div>
            <div className='dm-values'>
                <div className='dm-item'>{left.label}: <span className='dmv'>{left.value}px</span></div>
                <div className='dm-item'>{right.label}: <span className='dmv'>{right.value}px</span></div>
            </div>
        </div>
    )
}