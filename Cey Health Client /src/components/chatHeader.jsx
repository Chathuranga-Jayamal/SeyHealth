import { Bot, Sparkles, Heart, Shield } from 'lucide-react';

export default function ChatHeader() {
  return (
    <div className="text-center py-12 px-6">
      <div className="relative mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 rounded-3xl shadow-2xl shadow-purple-500/25 mb-4">
          <div className="relative">
            <Bot className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 via-blue-700 to-blue-700 bg-clip-text text-transparent mb-3">
        CeyHealth AI
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        Your intelligent health companion powered by advanced AI
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left  hover: border-accent">
            <p className="font-semibold text-gray-800 text-sm">Health Advice</p>
            <p className="text-xs text-gray-600">Personalized guidance</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Secure & Private</p>
            <p className="text-sm text-gray-600">Your data protected</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">AI Powered</p>
            <p className="text-sm text-gray-600">Latest technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}
