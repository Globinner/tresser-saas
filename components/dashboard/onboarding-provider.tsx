"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { OnboardingWalkthrough } from "./onboarding-walkthrough"

interface OnboardingContextType {
  startWalkthrough: () => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboardingTrigger() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboardingTrigger must be used within OnboardingProvider")
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
  hasShop: boolean
}

export function OnboardingProvider({ children, hasShop }: OnboardingProviderProps) {
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  const startWalkthrough = useCallback(() => {
    setShowWalkthrough(true)
  }, [])

  return (
    <OnboardingContext.Provider value={{ startWalkthrough }}>
      {children}
      {showWalkthrough && (
        <OnboardingWalkthroughModal 
          onClose={() => setShowWalkthrough(false)} 
        />
      )}
    </OnboardingContext.Provider>
  )
}

// Separate modal component
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Store, 
  Scissors, 
  Clock, 
  Link2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"

const steps = [
  {
    icon: <Store className="w-6 h-6" />,
    titleKey: "onboarding.step1Title",
    descriptionKey: "onboarding.step1Description",
    link: "/dashboard/settings"
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    titleKey: "onboarding.step2Title",
    descriptionKey: "onboarding.step2Description",
    link: "/dashboard/services"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    titleKey: "onboarding.step3Title",
    descriptionKey: "onboarding.step3Description",
    link: "/dashboard/settings?tab=booking"
  },
  {
    icon: <Link2 className="w-6 h-6" />,
    titleKey: "onboarding.step4Title",
    descriptionKey: "onboarding.step4Description",
    link: "/dashboard/settings?tab=booking"
  }
]

function OnboardingWalkthroughModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const { t, isRTL } = useLanguage()
  
  const handleComplete = () => {
    localStorage.setItem("tresser-onboarding-completed", "true")
    onClose()
  }
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">{t("onboarding.welcome")}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          
          {/* Step content */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isLastStep 
                ? "bg-green-500/10 text-green-500" 
                : "bg-primary/10 text-primary"
            }`}>
              {isLastStep ? <CheckCircle2 className="w-8 h-8" /> : step.icon}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {t(step.titleKey)}
            </h3>
            
            <p className="text-muted-foreground">
              {t(step.descriptionKey)}
            </p>
            
            <p className="text-sm text-muted-foreground mt-4">
              {t("onboarding.stepOf")
                .replace("{current}", String(currentStep + 1))
                .replace("{total}", String(steps.length))}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-muted-foreground"
            >
              {t("onboarding.skipTour")}
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  {isRTL ? (
                    <ChevronRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  )}
                  {t("onboarding.previousStep")}
                </Button>
              )}
              
              {isLastStep ? (
                <Button onClick={handleComplete} asChild>
                  <Link href={step.link}>
                    {t("onboarding.finishTour")}
                  </Link>
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  {t("onboarding.nextStep")}
                  {isRTL ? (
                    <ChevronLeft className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-1" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
