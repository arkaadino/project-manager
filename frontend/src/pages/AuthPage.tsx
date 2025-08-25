import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', registerData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:40px_40px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="bg-gray-800/95 border-gray-700 shadow-2xl">
          <CardHeader className="text-center p-0">
            {/* Logo */}
            <div className="flex justify-center items-center w-full">
            <img src="/Briefly-ext.svg" alt="Logo" className="w-40 h-40" />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="p-6">
                <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 border-gray-600">
                    <TabsTrigger 
                    value="login" 
                    className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                    </TabsTrigger>
                    <TabsTrigger 
                    value="register"
                    className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                    </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4 mt-6">
                    <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-gray-300">
                        Email
                        </Label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="Masukkan email Anda"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-gray-300">
                        Password
                        </Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="login-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Masukkan password Anda"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-300"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="link" className="p-0 h-auto text-sm text-blue-400 hover:text-blue-300">
                        Lupa password?
                        </Button>
                    </div>

                    <Button 
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Masuk
                    </Button>
                    </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4 mt-6">
                    <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="register-name" className="text-gray-300">
                        Nama Lengkap
                        </Label>
                        <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="register-name"
                            name="name"
                            type="text"
                            placeholder="Masukkan nama lengkap"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-gray-300">
                        Email
                        </Label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="Masukkan email Anda"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-gray-300">
                        Password
                        </Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Buat password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-300"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="register-confirm" className="text-gray-300">
                        Konfirmasi Password
                        </Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="register-confirm"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Konfirmasi password"
                            value={registerData.confirmPassword}
                            onChange={handleRegisterChange}
                            className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-300"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        </div>
                    </div>

                    <Button 
                        onClick={handleRegister}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Daftar
                    </Button>
                    </div>
                </TabsContent>
                </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2025 Project Manager. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;