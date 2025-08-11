import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DiscoveryCallForm from "@/components/DiscoveryCallForm";
import { X, Eye, Target, Palette, Video, MessageSquare, Settings, TrendingUp, CheckCircle, Calendar } from "lucide-react";

interface SeeCapabilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SeeCapabilitiesModal({ isOpen, onClose }: SeeCapabilitiesModalProps) {
  const [isDiscoveryFormOpen, setIsDiscoveryFormOpen] = useState(false);

  const capabilities = [
    {
      icon: <Target className="w-8 h-8 text-[#04E762]" />,
      title: "Content Strategy & Planning",
      description: "Weekly content playbooks tailored to your audience and brand goals."
    },
    {
      icon: <Palette className="w-8 h-8 text-[#04E762]" />,
      title: "Post Design & Captions",
      description: "Visuals and voice built to match your brand personality and engage your audience."
    },
    {
      icon: <Video className="w-8 h-8 text-[#04E762]" />,
      title: "Short Video Scripting",
      description: "We don't just edit — we guide what to say and how to deliver your message."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#04E762]" />,
      title: "Engagement (DMs & Comments)",
      description: "Real human interaction — not bots. We handle community management with care."
    },
    {
      icon: <Settings className="w-8 h-8 text-[#04E762]" />,
      title: "Video Editing",
      description: "Professional video editing to make your content stand out and drive results."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#04E762]" />,
      title: "Trend Analysis",
      description: "We monitor trends and implement the ones that align with your brand strategy."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-[#04E762]" />,
      title: "Performance Optimization",
      description: "Continuous analysis and refinement to improve engagement and growth metrics."
    }
  ];

  const handleClose = () => {
    onClose();
  };

  const handleBookDiscoveryCall = () => {
    setIsDiscoveryFormOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className="popup-glass-effect border-0 max-w-4xl w-full mx-4 p-0 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(4, 231, 98, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(4, 231, 98, 0.1)',
            borderRadius: '16px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            maxHeight: '85vh'
          }}
        >
          <div className="popup-decoration-dots"></div>
          <div className="popup-form-content p-8">
            <DialogHeader className="relative pb-6 mb-6">
              <button
                onClick={handleClose}
                className="absolute right-0 top-0 p-2 text-[#F8FAFC]/70 hover:text-[#04E762] transition-colors duration-200"
                data-testid="close-modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#04E762] to-[#04E762] rounded-lg">
                  <Eye className="w-6 h-6 text-[#0F172A]" />
                </div>
                <DialogTitle className="text-3xl font-bold text-white">
                  Our Capabilities
                </DialogTitle>
              </div>
              
              <DialogDescription className="text-white/80 text-lg leading-relaxed">
                Here's what we can do for your brand — but we're not revealing all our secrets just yet.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {capabilities.map((capability, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg border border-[#04E762]/20 hover:bg-[#04E762]/5 transition-all duration-300 hover:border-[#04E762]/40"
                  data-testid={`capability-${index}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0">
                      {capability.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-lg">
                        {capability.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={handleBookDiscoveryCall}
                className="bg-gradient-to-r from-[#04E762] to-[#04E762] hover:from-[#04E762] hover:to-[#04E762] hover:opacity-90 text-[#0F172A] font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#04E762]/25"
                data-testid="button-book-discovery-call"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Book a Discovery Call</span>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DiscoveryCallForm 
        isOpen={isDiscoveryFormOpen} 
        onClose={() => setIsDiscoveryFormOpen(false)} 
      />
    </>
  );
}