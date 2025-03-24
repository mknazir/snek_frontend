import { ClipPath, Defs, G, Path, Svg } from "react-native-svg";

export const HomeIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        fill="#66B2B2"
        d="M12.459.66a.758.758 0 0 0-.931 0L.75 9.065l.932 1.18L3 9.215V18.5A1.503 1.503 0 0 0 4.5 20h15a1.503 1.503 0 0 0 1.5-1.5V9.223l1.318 1.027.932-1.179L12.459.661ZM13.5 18.5h-3v-6h3v6Zm1.5 0v-6a1.502 1.502 0 0 0-1.5-1.5h-3A1.502 1.502 0 0 0 9 12.5v6H4.5V8.047L12 2.204l7.5 5.85V18.5H15Z"
      />
    </Svg>
  )

export const HomeIconFocus = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={20}
      fill="none"
      {...props}
    >
      <Path
        fill="#F5F5F5"
        d="M12.459.66a.758.758 0 0 0-.931 0L.75 9.065l.932 1.18L3 9.215V18.5A1.503 1.503 0 0 0 4.5 20h15a1.503 1.503 0 0 0 1.5-1.5V9.223l1.318 1.027.932-1.179L12.459.661ZM13.5 18.5h-3v-6h3v6Zm1.5 0v-6a1.502 1.502 0 0 0-1.5-1.5h-3A1.502 1.502 0 0 0 9 12.5v6H4.5V8.046L12 2.205l7.5 5.85V18.5H15Z"
      />
    </Svg>
  )

  export const RefreshIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={26}
      fill="none"
      {...props}
    >
      <Path
        fill="#717171"
        d="M27.75 13a12.75 12.75 0 0 1-12.579 12.75H15a12.668 12.668 0 0 1-8.752-3.48 1.063 1.063 0 1 1 1.46-1.544 10.625 10.625 0 1 0-.256-15.211L3.922 8.75h3.64a1.062 1.062 0 0 1 0 2.125H1.188A1.062 1.062 0 0 1 .125 9.813V3.438a1.062 1.062 0 1 1 2.125 0v3.957L6.002 3.97A12.75 12.75 0 0 1 27.75 13Z"
      />
    </Svg>
  )

  export const FilterIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={34}
      height={34}
      fill="none"
      {...props}
    >
      <G
        stroke="#717171"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.25}
        clipPath="url(#a)"
      >
        <Path d="M17 15.938v12.75M17 5.313v6.375M26.562 26.563v2.125M26.562 5.313v17M29.75 22.313h-6.376M7.437 22.313v6.375M7.437 5.313v12.75M4.25 18.063h6.374M20.187 11.688h-6.375" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h34v34H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )

  export const HeartIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={28}
      fill="none"
      {...props}
    >
      <Path
        fill="#F5536D"
        d="M31.75 9.344c0 9.844-14.596 17.811-15.217 18.14a1.126 1.126 0 0 1-1.066 0C14.845 27.155.25 19.187.25 9.344A8.729 8.729 0 0 1 8.969.625c2.904 0 5.446 1.249 7.031 3.36 1.585-2.111 4.127-3.36 7.031-3.36a8.729 8.729 0 0 1 8.719 8.719Z"
      />
    </Svg>
  )

  export const CrossIcon = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      fill="none"
      {...props}
    >
      <Path
        fill="#000"
        d="M14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41Z"
      />
    </Svg>
  )