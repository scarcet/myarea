// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Pressable,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
// } from 'react-native';
// import { Link, useRouter, router } from 'expo-router';
// import { useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import CustomInput from '@/components/CustomInput';
// import CustomButton from '../../components/CustomButton';

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';


// type SignUpFormData = {
//   email: string;
//   password: string;
//   postcode: string;
// };

// export default function SignUpScreen() {
//   const { control, handleSubmit, reset } = useForm<SignUpFormData>({
//     defaultValues: {email: '', password: '', postcode: '' },
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const onSignUp = async (formData: SignUpFormData) => {
//     const {email, password } = formData;


//         try {
//       setIsLoading(true);
//       const {
//         data: { session },
//         error,
//       } = await supabase.auth.signUp({ email, password });

//       if (error) Alert.alert(error.message);

//       if (!session)
//         Alert.alert('Please check your inbox for email verification!');
//     } catch (error) {
//       console.error('Login error:', error);
//       // TODO: Add proper error handling
//     } finally {
//       setIsLoading(false);
//     }

//     try {
//       setIsLoading(true);

//       const { data, error } = await supabase.auth.signUp({ email, password });
//       if (error) {
//         Alert.alert(error.message);
//         return;
//       }

//       const user = data.user;
//       if (!user) {
//         Alert.alert('Please check your inbox for email verification!');
//         return;
//       }

//       // Insert profile row
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .insert({
//           id: user.id,
//           username: postcode,
//           avatar_url: 'default.png',
//         })
//         .single();

//       if (profileError) {
//         console.error('Profile insert error:', profileError);
//         Alert.alert('Error creating profile');
//       } 
//       else {
//         Alert.alert('Account created successfully!');
//         reset();
//       }
//     } catch (err) {
//       console.error('Sign up error:', err);
//       Alert.alert('Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <View className="flex-1 items-center justify-center px-6">
//         <View className="w-full max-w-sm">
//           <Text className="text-3xl font-bold text-center mb-8 text-sky-500">
//             Create an account
//           </Text>

//           <View className="gap-4">

//            {/* Email */}
//             <CustomInput
//               control={control}
//               name="email"
//               placeholder="Enter your email"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               rules={{
//                 required: 'Email is required',
//                 pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
//               }}
//               className="w-full px-4 py-3 bg-neutral-300 border border-neutral-300 rounded-lg text-black placeholder:text-gray-500 focus:border-gray-400"
//             />
//              <CustomInput
//           control={control}
//           name='postcode'
//           placeholder='Post Code'
//           autoFocus
//           autoCapitalize='none'
//           keyboardType='default'
//           autoComplete='name'
//         />

//             {/* Password */}
//              <CustomInput
//               control={control}
//               name="password"
//               placeholder="Enter your password"
//               secureTextEntry
//               rules={{
//                 required: 'Password is required',
//                 minLength: { value: 8, message: 'Password must be at least 8 characters' },
//               }}
//               className="w-full px-4 py-3 bg-neutral-300 border border-neutral-300 rounded-lg text-black placeholder:text-gray-500 focus:border-gray-400"
//             />

//             {/* Sign Up Button */}
//             <TouchableOpacity
//               className="w-full bg-sky-500 py-3 rounded-lg mt-6"
//               activeOpacity={0.8}
//               onPress={handleSubmit(onSignUp)}
//               disabled={isLoading}
//             >
//               <Text className="text-white text-center font-semibold">
//                 {isLoading ? 'Signing up...' : 'Sign up'}
//               </Text>
//             </TouchableOpacity>

//             {/* Link to Sign In */}
//             <View className="flex-row justify-center mt-4">
//               <Text className="text-gray-400">Already have an account? </Text>
//               <Link href="/signIn" asChild>
//                 <Pressable>
//                   <Text className="text-sky-500 font-medium">Sign in</Text>
//                 </Pressable>
//               </Link>
//             </View>
//           </View>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });






import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform, 
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Please enter an email and password');
      return;
    }

    try {
      setIsLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({ email, password });

      if (error) Alert.alert(error.message);

      if (!session)
        // Alert.alert('Please check your inbox for email verification!');
        router.push('/completeProfileStep1');
    } catch (error) {
      console.error('Login error:', error);
      // TODO: Add proper error handling
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 90, paddingHorizontal: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className='w-full max-w-md self-center'>
        <Text className='text-4xl font-bold text-center mb-10 text-sky-500'>
          Create Account
        </Text>

        <View className='gap-4'>
          <View>
            <Text className='text-lg font-semibold text-neutral-900 mb-1'>Email</Text>
            <TextInput
              className='w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400'
              placeholder='Enter your email'
              placeholderTextColor='#6B7280'
              keyboardType='email-address'
              autoCapitalize='none'
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className='text-lg font-semibold text-neutral-900 mb-1'>Password</Text>
            <TextInput
              className='w-full px-6 py-4 bg-neutral-300 border border-neutral-300 rounded-2xl text-black text-lg placeholder:text-gray-500 focus:border-gray-400'
              placeholder='Enter your password'
              placeholderTextColor='#6B7280'
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className='w-full bg-sky-500 py-4 rounded-2xl mt-4'
            activeOpacity={0.85}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className='text-white text-center font-bold text-lg'>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Text>
          </TouchableOpacity>

          <View className='flex-row justify-center mt-2'>
            <Text className='text-gray-400 text-base'>Already have an account? </Text>
            <Link href='/signIn' asChild>
              <Pressable>
                <Text className='text-sky-500 font-medium text-base'>Sign in</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})




// import { styles } from "../../styles/auth.styles";
// import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
// import { Link, useRouter, router } from 'expo-router';
// import { View, Text, Image, TextInput, Pressable,TouchableOpacity, StyleSheet, Button, KeyboardAvoidingView, Platform } from "react-native";
// import React from 'react';
// import CustomInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';

// const signUpSchema = z.object({
//   email: z.string({ message: 'Email is required' }).email('Invalid email'),
//   name: z.string({ message: 'Name is required' }),
//  postCode: z.string({ message: 'Name is required' }),
//   password: z 
//     .string({ message: 'Password is required' })
//     .min(8, 'Password should be at least 8 characters long'),
// });

// type SignUpFields = z.infer<typeof signUpSchema>;

// const mapClerkErrorToFormField = (error: any) => {
//   switch (error.meta?.paramName) {
//     case 'email_address':
//       return 'email';
//     case 'password':
//       return 'password';
//     default:
//       return 'root';
//   }
// };

// export default function SignUpScreen() {
  
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<SignUpFields>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const { signUp, isLoaded } = useSignUp();
//   const onSignUp = async (data: SignUpFields) => {
//     if (!isLoaded) return;
    
//     try {
//       await signUp.create({
//         emailAddress: data.email,
//         password: data.password,
//       });

//       await signUp.prepareVerification({ strategy: 'email_code' });

//       router.push('/verify');

//     } catch (err) {
//       console.log('Sign up error: ', err);
//       if (isClerkAPIResponseError(err)) {
//         err.errors.forEach((error) => {
//           console.log('Error: ', JSON.stringify(error, null, 2));
//           const fieldName = mapClerkErrorToFormField(error);
//           console.log('Field name: ', fieldName);
//           setError(fieldName, {
//             message: error.longMessage,
//           });
//         });
//       } else {
//         setError('root', { message: 'Unknown error' });
//       }
//     }

//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       {/* BRAND SECTION */}
//       <View style={styles.brandSection}>
//         <Text style={styles.appName}>Sign Up To YourArea</Text>
//         <Text style={styles.tagline}>Connect and share with people in your area</Text>
//       </View>

//       {/* Inputs for sign up */}

//       <CustomInput
//           control={control}
//           name='name'
//           placeholder='Name/Username'
//           autoFocus
//           autoCapitalize='none'
//           keyboardType='default'
//           autoComplete='name'
//         />

//       <CustomInput
//           control={control}
//           name='postCode'
//           placeholder='Post Code'
//           autoFocus
//           autoCapitalize='none'
//           keyboardType='default'
//           autoComplete='name'
//         />

//       <CustomInput
//           control={control}
//           name='email'
//           placeholder='Email'
//           autoFocus
//           autoCapitalize='none'
//           keyboardType='email-address'
//           autoComplete='email'
//         />

// <CustomInput
//           control={control}
//           name='password'
//           placeholder='Password'
//           secureTextEntry
//         />

// {errors.root && (
//           <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
//         )}

//       {/* LOGIN SECTION */}
//       <View style={styles.loginSection}>

//       <CustomButton text='Sign Up' onPress={handleSubmit(onSignUp)} />

//       <Link href='/signIn' style={styles.link}>
//       Already have an account? Sign in
//       </Link>

//         <Text style={styles.termsText}>
//           By continuing, you agree to our Terms and Privacy Policy
//         </Text>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }