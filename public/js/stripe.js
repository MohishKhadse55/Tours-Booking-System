import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51LheneSEQBoEvEEqyoAXlxebGJH75I6sPBkYbC9QoBbVPY4l5KvYYAyFe0iGaducMvzxISNSSfG4HogSIk1jAJ0D00IYyDOEjX'
    );
    // 1 Get checkout session from the api
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }

  // 2 Create checkoout form and charge credit card
};
