import { Alert, AlertIcon, AlertProps, Box, CloseButton, Text } from '@chakra-ui/react'

export const AlertBanner = ({ variant = "left-accent", heading, onClose, children, ...props }) => {

    return (
        <Alert variant={variant} {...props} exit={{ opacity: 0 }}>
            <AlertIcon />
            <Box>
                {heading && <Text fontSize="sm" fontWeight="medium">{heading}</Text>}
                {children && <Text fontSize="small">{children}</Text>}
            </Box>
            {onClose &&
                <CloseButton
                    alignSelf='flex-start'
                    position='relative'
                    right={-1}
                    top={-1}
                    onClick={onClose}
                />
            }
        </Alert>
    )
}