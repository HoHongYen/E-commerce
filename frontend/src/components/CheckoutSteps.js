import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
	return (
		<Row className='checkout-steps'>
			<Col className={props.step1 ? 'active' : ''}>Sign in</Col>
			<Col className={props.step2 ? 'active' : ''}>Shipping</Col>
			<Col className={props.step3 ? 'active' : ''}>Payment</Col>
			<Col className={props.step4 ? 'active' : ''}>Place order</Col>
		</Row>
	)
}