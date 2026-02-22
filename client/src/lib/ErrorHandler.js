import { useToast } from "vue-toastification";

var ErrorHandler = {

  toast(error) {
     const toast = useToast();
     if(error.response && error.response.data && error.response.data.messages){
       error.response.data.messages.forEach((item, i) => {
         toast.error(item);
       });
     }else{
       toast.error(error.message)
     }
  },
  message(error) {
     const toast = useToast();
     if(error.response && error.response.data && error.response.data.messages){
       return error.response.data.messages.join('\r\n')
     }else{
       return error.message
     }
  },

};

export default ErrorHandler
