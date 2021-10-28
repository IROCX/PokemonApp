import { render, unmountComponentAtNode } from "react-dom";
import Snackbar from "../components/SnackbarComponent/Snackbar";

export const toast = {
    remove: () => {
        unmountComponentAtNode(document.getElementById("snackbar-container"));
        toast.currentToast = false;
        if (toast.timeout) {
            clearTimeout(toast.timeout);
            toast.timeout = null;
        }
    },
    currentToast: false,
    timeout: null,
    notify: ({ message, type }) => {
        let duration = 3;
        if (toast.currentToast) {
            toast.remove();
        }
        render(<Snackbar text={message} type={type} />, document.getElementById("snackbar-container"));
        let x = document.getElementById("snackbar");
        if (x){
            x.className = `show ${type}`;
            toast.currentToast = true;
        }

        toast.timeout = setTimeout(toast.remove, duration * 1000);
    },
};
