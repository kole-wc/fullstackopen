const Notification = ({ status, message }) => {
    if (message === '') {
        return ''
    } else {
        if (status === 'added') {
            return (
                <div className='success'>
                {message}
                </div>
            );
        } else if (status === 'updated') {
            return (
                <div className='success'>
                {message}
                </div>
            );
        } else {
            return (
                <div className='error'>
                {message}
                </div>
            );
        }
    }
}

export default Notification;