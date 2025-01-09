import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { CirclePicker, ColorResult } from "react-color";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";

export const SetColor: FC = () => {
  const [customcolor, setCustomColor] = useState("#FFFFFF");
  const colorChangeHandler = (color: ColorResult) => {
    setCustomColor(color.hex);
  };

  const buttonClickHandler = () => {
    console.log("click");
  };

  return (
    <>
      {/* <Card sx={{ mb: 3 }}>
        <CardHeader title="Pick a color" />
        <CardMedia
          sx={{ backgroundColor: customcolor, height: 50 }}
          component="div"
        />
        <CardContent>
          <CirclePicker color={customcolor} onChange={colorChangeHandler} />
        </CardContent>
      </Card> */}

      <Button variant="outlined" onClick={buttonClickHandler}>
        <FormatColorFillIcon />
      </Button>
    </>
  );
};
