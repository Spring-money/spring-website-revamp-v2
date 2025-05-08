import styles from './Options.module.css'
import { Button } from "../Button"

export default function Option(props) {
  return (
    <>
      <Button
        {...props}
        color="gray_900"
        width={props.width}
        size="lg"
        shape="round"
        className={`${"hover:bg-gray-950 hover:text-white"} ${props.className}`}
      >
        {props.children}
      </Button>
    </>
  );
}
