import { Circle, ClipPath, Defs, G, Svg,Path, Rect } from "react-native-svg";

export const EllipseIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={11}
      fill="none"
      {...props}
    >
      <Circle cx={5.992} cy={5.008} r={5.008} fill="#D9F2F3" />
    </Svg>
  )

  export const EllipseIconFocus = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={11}
      fill="none"
      {...props}
    >
      <Circle cx={5.008} cy={5.008} r={5.008} fill="#00AAAF" />
    </Svg>
  )

  export const LanguageIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={19}
      fill="none"
      {...props}
    >
      <G
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.125}
        clipPath="url(#a)"
      >
        <Path d="m16.875 15.204-3.938-7.875L9 15.204M10.125 12.954h5.625M6.75 2.266v1.688M2.25 3.954h9M9 3.954a6.75 6.75 0 0 1-6.75 6.75" />
        <Path d="M4.885 6.204a6.75 6.75 0 0 0 6.365 4.5" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 .016h18v18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )

  export const EyeIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={20}
      fill="none"
      {...props}
    >
      <G
        stroke="#6A707C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.188}
        clipPath="url(#a)"
      >
        <Path d="M9.813 4.5C3.875 4.5 1.5 9.844 1.5 9.844s2.375 5.344 8.313 5.344c5.937 0 8.312-5.344 8.312-5.344S15.75 4.5 9.812 4.5Z" />
        <Path d="M9.813 12.813a2.969 2.969 0 1 0 0-5.938 2.969 2.969 0 0 0 0 5.938Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 .5h19v19H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )

  export const EyeOffIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={19}
      fill="none"
      {...props}
    >
      <G
        stroke="#6A707C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.188}
        clipPath="url(#a)"
      >
        <Path d="M3.563 2.969 15.437 16.03M11.497 11.697a2.97 2.97 0 0 1-3.994-4.394M10.059 6.584a2.969 2.969 0 0 1 2.397 2.637" />
        <Path d="M15.483 12.55c1.618-1.448 2.33-3.05 2.33-3.05S15.438 4.156 9.5 4.156c-.514 0-1.027.041-1.535.125M5.492 5.091C2.466 6.623 1.188 9.5 1.188 9.5s2.375 5.344 8.312 5.344a8.762 8.762 0 0 0 4.008-.935" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h19v19H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )

  export const BackIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={26}
      fill="none"
      {...props}
    >
      <Rect width={26} height={26} fill="#66B2B2" rx={13} />
      <Path
        fill="#fff"
        d="m15.295 19 1.41-1.41-4.58-4.59 4.58-4.59L15.295 7l-6 6 6 6Z"
      />
    </Svg>
  )

  export const CameraIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={11}
      fill="none"
      {...props}
    >
      <Path
        fill="#1E1E1E"
        d="M12.586 3.083v6.75c0 .621-.504 1.125-1.125 1.125H1.71A1.125 1.125 0 0 1 .586 9.833v-6.75c0-.621.504-1.125 1.125-1.125h2.062l.289-.771A1.123 1.123 0 0 1 5.114.458h2.941c.47 0 .889.29 1.053.729l.29.771h2.063c.621 0 1.125.504 1.125 1.125ZM9.398 6.458a2.815 2.815 0 0 0-2.812-2.812 2.815 2.815 0 0 0-2.813 2.812 2.815 2.815 0 0 0 2.813 2.813 2.815 2.815 0 0 0 2.812-2.813Zm-.75 0a2.066 2.066 0 0 1-2.062 2.063 2.066 2.066 0 0 1-2.063-2.063c0-1.137.926-2.062 2.063-2.062s2.062.925 2.062 2.062Z"
      />
    </Svg>
  )

  export const UploadIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        fill="#979797"
        d="M6.71 4.716 8 3.416v11.59a1 1 0 1 0 2 0V3.416l1.29 1.3a1 1 0 0 0 1.639-.326 1 1 0 0 0-.219-1.094l-3-3a1 1 0 0 0-1.42 0l-3 3a1.004 1.004 0 0 0 1.42 1.42ZM15 7.006h-2a1 1 0 1 0 0 2h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2a1 1 0 0 0 0-2H3a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3Z"
      />
    </Svg>
  )