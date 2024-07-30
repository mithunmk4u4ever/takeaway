import { useState } from 'react'
import axios from 'axios'
import img from "../Images/fooddelivery.png"
function Payment(props) {
  const {totalprice} = props
  const [payable, setPayable] = useState(totalprice)

  const userId=localStorage.getItem('userId')

const valueText=`Proceed to payment of ₹${payable} through Payment Gateway->`
  // const amountPayable=parseInt(payable)*100
  console.log("amountPayable",payable);
  const makePayment = async (e) => {
    const jsonPayload = JSON.stringify({
      amount: payable*100,
      currency: 'INR',
      receipt: 'receipt#1'
    });

    try {
      const response = await axios.post('http://localhost:3300/api/makepayment', jsonPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Payment response:', response.data);

      const order=response.data

      const options = {
        "key": "rzp_test_PrNL0CK2Fka2qA", // Enter the Key ID generated from the Dashboard
        "amount": payable, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "TAKE AWAY", //your business name
        "description": "items will be delivered soon!",
        // "image": "https://cdn.dribbble.com/users/1751799/screenshots/5512482/check02.gif",
        "image":img,
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": async function (response){
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
            const body={
              ...response,userId
            }
            const validate=await axios.post("http://localhost:3300/api/validatepayment",body)
            console.log(validate.data)
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "Mithun", //your customer's name
            "email": "mithunmk4u4ever@gmail.com", //your customer's email 
            "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Takeaway Cuisines"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
    } catch (error) {
      console.error('Error making payment:', error);
    }
  }
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",}}>
        {/* <input type="text" style={{color:"white",backgroundColor:"black",width:"auto",height:"30px",border:"none",margin:"30px",borderRadius:"5px"}} value={valueText} readonly /> */}
        <button style={{borderRadius:"5px"}} onClick={makePayment}>
          {valueText}
        </button>
      </div>
    )
  }

  export default Payment