import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Helmet } from "react-helmet-async"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Store } from "../Store"
import { toast } from "react-toastify"
import { getError } from "../utils"

export default function SignupScreen() {
	const navigate = useNavigate();
	const { search } = useLocation();
	const redirectInUrl = new URLSearchParams(search).get('redirect');
	const redirect = redirectInUrl ? redirectInUrl : '/';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error('Passwords do not match!');
		}
		try {
			const { data } = await axios.post('/api/users/signup', {
				name,
				email,
				password,
			});
			ctxDispatch({ type: 'USER_SIGNIN', payload: data });
			localStorage.setItem('userInfo', JSON.stringify(data));
			navigate(redirect || '/');
		} catch(error) {
			toast.error(getError(error));
		}
	}

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign up</title>
			</Helmet>
			<h1 className="my-3">Sign up</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="name">
					<Form.Label>Name</Form.Label>
					<Form.Control type="text" required onChange={(e) => setName(e.target.value)} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="confirmPassword">
					<Form.Label>Confirm password</Form.Label>
					<Form.Control type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />
				</Form.Group>
				<div className="mb-3">
					<Button type="submit">Sign up</Button>
				</div>
				<div>
					Already have an account?{' '}
					<Link to={`/signin?redirect=${redirect}`}>Sign in</Link>
				</div>
			</Form>
		</Container>
	)
}