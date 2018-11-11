import { createMuiTheme } from '@material-ui/core/styles';

const colortheme = createMuiTheme({
  palette: {
    primary: {
        main: '#E9C46A',
    },
    secondary: {
        main: '#264653',
    },
    accent: {
        main: '#E76F51',
    },
    type: 'light'
    // black_contrast: {
    //     main: '#fff',
    // },
    // sandy_brown: {
    //   main: '#F4A261',
    // },
    // jungle_green: {
    //     main: '#2A9D8F',
    // },
    // white_contrast: {
    //     contrastText: '#000',
    // }
}
});
export default colortheme;