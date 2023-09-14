const Filter = ({ searchValue, handleSearch }) => {
    return (
        <>
            filter shown with<input value={searchValue} onChange={handleSearch} />
        </>
    )
}

export default Filter;