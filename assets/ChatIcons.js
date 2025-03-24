import { Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useChat } from "../Context/ChatContext";


export const ChatIcon = (props) => {
  const { totalUnreadMessageCount } = useChat();
  return (
    <View style={{ position: "relative" }}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={21}
        fill="none"
        {...props}
      >
        <Path
          fill="#66B2B2"
          d="M20.308 0H1.692C1.244 0 .813.184.496.513A1.78 1.78 0 0 0 0 1.75v17.5c-.002.334.09.66.263.942a1.693 1.693 0 0 0 1.43.808 1.649 1.649 0 0 0 1.083-.413l.01-.008L6.24 17.5h14.068c.448 0 .879-.184 1.196-.513A1.78 1.78 0 0 0 22 15.75v-14c0-.464-.178-.91-.496-1.237A1.664 1.664 0 0 0 20.308 0Zm0 15.75H5.923a.83.83 0 0 0-.553.213L1.692 19.25V1.75h18.616v14Z"
        />
      </Svg>
      {totalUnreadMessageCount > 0 && <View style={{ position: "absolute", top: -4, right: -4, backgroundColor: "red", width: 8, height: 8, borderRadius: 10, }} />}

    </View>
  )
}
export const ChatIconFocus = (props) => {
  const { totalUnreadMessageCount } = useChat();
  return (
    <View style={{ position: "relative" }}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={21}
        fill="none"
        {...props}
      >
        <Path
          fill="#F1F1F1"
          d="M20.308 0H1.692C1.244 0 .813.184.496.513A1.78 1.78 0 0 0 0 1.75v17.5c-.002.334.09.66.263.942a1.693 1.693 0 0 0 1.43.808 1.649 1.649 0 0 0 1.083-.413l.01-.008L6.24 17.5h14.068c.448 0 .879-.184 1.196-.513A1.78 1.78 0 0 0 22 15.75v-14c0-.464-.178-.91-.496-1.237A1.664 1.664 0 0 0 20.308 0Zm0 15.75H5.923a.83.83 0 0 0-.553.213L1.692 19.25V1.75h18.616v14Z"
        />
      </Svg>
      {totalUnreadMessageCount > 0 && <View style={{ position: "absolute", top: -4, right: -4, backgroundColor: "red", width: 8, height: 8, borderRadius: 10, }} />}
    </View>

  )
}