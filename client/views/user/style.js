
import avatarBg from './bg.jpg'

export const loginStyle = {
    root: {
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
        input: {
        width: 300,
        marginBottom: 20,
    },
        loginButton: {
        width: 300,
    },
}

export const userStyle = {
    root: {},
    avatar: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundImage: `url(${avatarBg})`,
        // backgroundSize: 'cover',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    avatarImg: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    userName: {
        color: '#fff',
        zIndex: '1',
    },
    bg: {
        backgroundImage: `url(${avatarBg})`,
        backgroundSize: 'cover',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        '&::after': {
            content: '\' \'',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
        },
    },
}

export const userInfoStyle = (theme) => {
    return {
        root: {
            padding: 16,
            minHeight: 400,
        },
        gridContainer: {
            height: '100%',
        },
        paper: {
            height: '100%',
        },
        partTitle: {
            lineHeight: '40px',
            paddingLeft: 20,
            backgroundColor: theme.palette.primary[700],
            color: '#fff',
        },
        '@media screen and (max-width: 480px)': {
            root: {
                padding: 10,
                minHeight: 300,
            },
        },
    }
}
