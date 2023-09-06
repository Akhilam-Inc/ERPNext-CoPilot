'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    FormErrorMessage,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form'
import { useFrappeAuth } from 'frappe-react-sdk'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { AlertBanner } from '../common/Alert';

const validationSchema = Yup.object().shape({
    email: Yup.string().email()
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export default function SignupCard() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { login, currentUser, isLoading } = useContext(UserContext);

    useEffect(() => {
        if (currentUser) {
            navigate('/erpnextcopilot/', { replace: true })
        }

    }, [currentUser]);

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: 'erpnextcopilot@erp.com',
            password: 'ERPNextCopilot@1234'
        },
        resolver: yupResolver(validationSchema),
    })

    const onSubmit = async (values) => {
        setError(null)
        return login(values.email, values.password).catch(err => setError(err.message))
    }

    if (isLoading) return <div>loading...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <Flex
                minH={'100vh'}
                minW={'100vw'}
                w={'100%'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack flex={'1'} spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>

                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Welocome to ERPNext CoPilot
                        </Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            A natural language interface for ERPNext!
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                            {error &&
                                <AlertBanner status='error' mb={3}>{error}</AlertBanner>}
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired isInvalid={!!errors?.email}>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email"
                                    {...register('email')} />
                                {errors?.email?.message &&
                                    <FormErrorMessage >{errors?.email?.message}</FormErrorMessage>
                                }

                            </FormControl>
                            <FormControl id="password" isRequired isInvalid={!!errors?.password}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'} {...register('password')} />
                                    <InputRightElement h={'full'}>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                {errors?.password?.message &&
                                    <FormErrorMessage >{errors?.password?.message}</FormErrorMessage>
                                }
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    size="lg"
                                    type='submit'
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign In
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </form>

    )
}