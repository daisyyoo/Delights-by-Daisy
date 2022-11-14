// import React from 'react';
// import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
// import { toDollars } from '../lib/';

// const styles = {
//   header: {

//   }
// };
// export default class Basket extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cookies: []
//     };
//   }

//   componentDidMount() {
//     fetch('/myBasket')
//       .then(res => res.json())
//       .then(cookies => {
//         this.setState({ cookies });
//       });
//   }

//   render() {
//     // show an empty message if there is no token, saying add items to basket now
//     return (
//       <>
//         <h1 className="py-1" style={styles.header}>My Basket</h1>
//         <div className="row">
//           {
//             this.state.cookies.map(product => (
//               <div key={product.cookieId}>
//                 <BasketItems product={product} />
//               </div>
//             ))
//           }
//         </div>
//         <div>
//           <div className="d-flex justify-content-between">
//             <h4>{`Subtotal (${this.state.cookies.length} items)`}</h4>
//             <h4>otal Price</h4>
//           </div>
//           <p>Taxes and shipping calculated at checkout</p>
//           <Button className="button-all">PROCEED TO CHECKOUT</Button>
//         </div>

//       </>
//     );
//   }
// }

// function BasketItems(props) {
//   const { cartId, cookieId, quantity, flavor, weight, price, imageUrl } = props.product;
//   return (
//     <>
//       <div>
//         <img src={imageUrl} />
//       </div>
//       <Card>
//         <Card.Body>
//           <Card.Text>{flavor}</Card.Text>
//           <Card.Text>{weight}</Card.Text>
//           <Card.Text>{`${toDollars(price)}`}</Card.Text>
//           <Card.Text>{quantity}</Card.Text>
//         </Card.Body>
//       </Card>
//     </>

//   );

// }
