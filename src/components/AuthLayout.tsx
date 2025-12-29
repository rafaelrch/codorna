import React from 'react';
import { Card, CardContent } from './ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
}

export function AuthLayout({ children, title, subtitle, description, backgroundImage, backgroundImageAlt }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Promotional Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        {backgroundImage && (
          <div className="absolute inset-5">
            <img 
              src={backgroundImage} 
              alt={backgroundImageAlt || "Imagem de fundo"} 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        )}
        
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <img 
                src="/CODORNA-LOGO.png" 
                alt="Codorna Logo" 
                className="h-10 w-auto mr-3"
              />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {title}
            </h2>
            <p className="text-slate-600">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
