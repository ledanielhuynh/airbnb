import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';

import { postRegisterUser } from '../helpers/helpers';
import { useContext, Context } from '../helpers/context';

const Register = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [reenteredPassword, setReenteredPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const { setters } = useContext(Context);
  const navigate = useNavigate();

  const register = async () => {
    if (password !== reenteredPassword) {
      setError('Passwords do not match');
      return;
    }

    const body = { email, password, name };
    const data = await postRegisterUser(body);
    if (data.error) {
      setError(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      setters.setUserEmail(email);
      navigate('/');
    }
  };

  return (
    <>
      <div className="relative">
        <div className="fixed inset-0 flex justify-center items-center z-30 bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col px-4 py-4 m-4 w-full max-w-[48rem] bg-white rounded-md gap-4 shadow-md animate-fade-in  text-sm md:text-base">
            <b className='text-center  text-base md:text-lg'>Register</b>
            <hr />
            <div className='grid grid-cols-2 gap-4'>
              <Input id="Email" type="email" setId={setEmail} />
              <Input id="Name" type="text" setId={setName} />
              <Input id="Password" type="password" setId={setPassword} />
              <Input id="Re-Enter Password" type="password" setId={setReenteredPassword} />
            </div>
            <hr className="my-1" />
            {error && <ErrorMessage message={error} />}
            <Button label="REGISTER" onClick={register} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
