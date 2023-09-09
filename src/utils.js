import moment from "moment";
import Toast from "react-native-toast-message";

export function getCurrentTime() {
  return moment(new Date()).format("DD-MM-YYYY, hh:mm A");
}

export function getOnlyNumbers(text = "") {
  return text?.replace(/\D/g, "");
}
export const showToast = ({mainText, subText="", type = "success"}) => {
  Toast.show({
    type: type,
    text1: mainText,
    text2: subText,
  });
};
