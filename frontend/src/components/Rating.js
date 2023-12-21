const Rating = (props) => {
	const { rating, numReviews, caption } = props;
	const array = [1, 2, 3, 4, 5];

	return (
		<div className="rating">
			{
				array.map((i) => (
					<span key={i}>
						<i
							className={
								rating >= i ? 'fas fa-star' :
									rating >= i - 0.5 ? 'fas fa-star-half-alt' :
										'far fa-star'
							}>
						</i>
					</span>
				))
			}
			{caption ? (
				<span>{caption}</span>
			) : (
				<span>{' ' + numReviews + ' reviews'}</span>
			)}
		</div>
	)
}

export default Rating;