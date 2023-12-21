import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from "./Store";

import HomeScreen from './screen/HomeScreen';
import ProductScreen from "./screen/ProductScreen";
import CartScreen from "./screen/CartScreen";
import SigninScreen from "./screen/SigninScreen";
import SignupScreen from "./screen/SignupScreen";
import ShippingAddressScreen from "./screen/ShippingAddressScreen";
import PaymentMethodScreen from "./screen/PaymentMethodScreen";
import PlaceOrderScreen from "./screen/PlaceOrderScreen";
import OrderScreen from "./screen/OrderScreen";
import OrderHistoryScreen from "./screen/OrderHistoryScreen";
import ProfileScreen from "./screen/ProfileScreen";
import Button from "react-bootstrap/Button";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screen/SearchScreen";

function App() {
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart, userInfo } = state;

	const signoutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
		window.location.href = '/signin';
	}

	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data } = await axios.get(`/api/products/categories`);
				setCategories(data);
			} catch (error) {
				toast.error(getError(error));
			}
		}
		fetchCategories();
	}, []);

	return (
		<BrowserRouter>
			<div
				className={
					sidebarIsOpen ? "d-flex flex-column site-container active-cont"
						: "d-flex flex-column site-container"
				}
			>
				<ToastContainer position="bottom-center" limit={1} />
				<header>
					<NavBar bg="dark" variant="dark" expand="lg">
						<Container>
							<Button
								variant="dark"
								onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
							>
								<i className="fas fa-bars"></i>
							</Button>
							<LinkContainer to="/">
								<NavBar.Brand>amazona</NavBar.Brand>
							</LinkContainer>
							<NavBar.Toggle aria-controls="basic-navbar-nav" />
							<NavBar.Collapse id="basic-navbar-nav" >
								<SearchBox />
								<Nav className="me-auto w-100 justify-content-end">
									<Link to="/cart" className="nav-link">
										Cart
										{cart.cartItems.length > 0 && (
											<Badge pill bg="danger">
												{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
											</Badge>
										)}
									</Link>
									{userInfo ? (
										<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
											<LinkContainer to="/profile">
												<NavDropdown.Item>Profile</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item>Order history</NavDropdown.Item>
											</LinkContainer>
											<NavDropdown.Divider />
											<Link
												className="dropdown-item"
												to="#signout"
												onClick={signoutHandler}
											>
												Sign out
											</Link>
										</NavDropdown>
									) : (
										<Link to="/signin" className="nav-link">
											Sign in
										</Link>
									)}
								</Nav>
							</NavBar.Collapse>
						</Container>
					</NavBar>
				</header>
				<div
					className={
						sidebarIsOpen ?
						"active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
						: "side-navbar d-flex justify-content-between flex-wrap flex-column"
					}
				>
					<Nav className="flex-column text-white w-100 p-2">
						<Nav.Item>
							<strong>Categories</strong>
						</Nav.Item>
						{categories.map((category) => (
							<Nav.Item key={category}>
								<LinkContainer
									to={{ pathname: '/search', search: `category=${category}` }}
									onClick={() => setSidebarIsOpen(false)}
								>
									<Nav.Link>{category}</Nav.Link>
								</LinkContainer>
							</Nav.Item>
						))}
					</Nav>
				</div>
				<main>
					<Container className="mt-3">
						<Routes>
							<Route path="/product/:slug" element={<ProductScreen />} />
							<Route path="/cart" element={<CartScreen />} />
							<Route path="/search" element={<SearchScreen />} />
							<Route path="/signin" element={<SigninScreen />} />
							<Route path="/signup" element={<SignupScreen />} />
							<Route path="/profile" element={<ProfileScreen />} />
							<Route path="/shipping" element={<ShippingAddressScreen />} />
							<Route path="/payment" element={<PaymentMethodScreen />} />
							<Route path="/placeorder" element={<PlaceOrderScreen />} />
							<Route path="/order/:id" element={<OrderScreen />} />
							<Route path="/orderhistory" element={<OrderHistoryScreen />} />
							<Route path="/" element={<HomeScreen />} />
						</Routes>
					</Container>
				</main>
				<footer>
					<div className="text-center">All rights reserved.</div>
				</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
