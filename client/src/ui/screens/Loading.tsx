// .loading-page {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: #f0e6d6; /* Couleur de fond de thème médiéval */
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 9999; /* S'assurer que le loader est au-dessus de tout */
// }

// .loader {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

export const Loading = () => {
  return (
    <div className="w-full h-full bg-theme-medieval flex justify-center items-center z-50">
      <div className="flex justify-center items-center">
        <svg
          width="200px"
          height="200px"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          fill="#654321"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#654321"
            stroke-width="5"
            fill="none"
          />
          <g>
            <path d="M50 5 L55 20 L50 35 L45 20 Z" fill="#654321">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                begin="0.1s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M50 95 L55 80 L50 65 L45 80 Z" fill="#654321">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                begin="0.1s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M5 50 L20 45 L35 50 L20 55 Z" fill="#654321">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                begin="0.1s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M95 50 L80 45 L65 50 L80 55 Z" fill="#654321">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                begin="0.1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </svg>
      </div>
    </div>
  );
};
