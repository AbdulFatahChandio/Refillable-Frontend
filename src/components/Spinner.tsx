
type PropType = {
    mainClassName?: string;
    className?: string;
    width?: number
    height?: number
}
const Spinner = ({ mainClassName, className, height = 60, width = 60 }: PropType) => {
    return (
        <div className={`p-0 m-0 flex justify-center ${mainClassName}`}>
            <svg width={width} height={height} className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 100 100" stroke="none">
                <path d="M50 15A35 35 0 1 0 85 50h10A45 45 0 1 1 50 5v10z" fill="currentColor"></path>
            </svg>
        </div>
    )
}
export default Spinner