// components/DemoCredentials.tsx
import React from 'react';
import { Info, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DemoCredentials: React.FC = () => {
  const demoUsers = [
    { username: 'emilys', password: 'emilyspass', name: 'Emily Johnson' },
    { username: 'michaelw', password: 'michaelwpass', name: 'Michael Williams' },
    { username: 'sophiab', password: 'sophiabpass', name: 'Sophia Brown' },
    { username: 'jamesd', password: 'jamesdpass', name: 'James Davis' },
    { username: 'emmaj', password: 'emmajapass', name: 'Emma Johnson' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const copyCredentials = (username: string, password: string) => {
    navigator.clipboard.writeText(`${username}`);
    toast.success(`Username "${username}" copied to clipboard!`);
  };

  return (
    <Card className="w-full max-w-md mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Gunakan salah satu akun demo berikut untuk testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {demoUsers.slice(0, 3).map((user, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-600">
                {user.username} / {user.password}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyCredentials(user.username, user.password)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          💡 Klik icon copy untuk menyalin username ke clipboard
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoCredentials;