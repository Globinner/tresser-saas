"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useRouter } from "next/navigation"
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
  Sparkles,
  ArrowRight
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

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

const steps = [
  {
    icon: Store,
    titleKey: "onboarding.step1Title",
    descriptionKey: "onboarding.step1Description",
    route: "/dashboard/settings?tab=shop",
    actionKey: "onboarding.goToShopSettings"
  },
  {
    icon: Scissors,
    titleKey: "onboarding.step2Title",
    descriptionKey: "onboarding.step2Description",
    route: "/dashboard/services",
    actionKey: "onboarding.goToServices"
  },
  {
    icon: Clock,
    titleKey: "onboarding.step3Title",
    descriptionKey: "onboarding.step3Description",
    route: "/dashboard/settings?tab=booking",
    actionKey: "onboarding.goToBookingSettings"
  },
  {
    icon: Link2,
    titleKey: "onboarding.step4Title",
    descriptionKey: "onboarding.step4Description",
    route: "/dashboard/settings?tab=booking",
    actionKey: "onboarding.goToBookingLink"
  }
]

function OnboardingWalkthroughModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const { t, isRTL } = useLanguage()
  const router = useRouter()
  
  const handleComplete = () => {
    localStorage.setItem("tresser-onboarding-completed", "true")
    onClose()
  }
  
  const goToStep = (stepIndex: number) => {
    const step = steps[stepIndex]
    // Navigate to the step's route and close modal
    router.push(step.route)
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
  const StepIcon = step.icon
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
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isLastStep 
                ? "bg-green-500/10 text-green-500" 
                : "bg-primary/10 text-primary"
            }`}>
              {isLastStep ? <CheckCircle2 className="w-8 h-8" /> : <StepIcon className="w-8 h-8" />}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {t(step.titleKey)}
            </h3>
            
            <p className="text-muted-foreground mb-4">
              {t(step.descriptionKey)}
            </p>
            
            {/* Go to this step button */}
            <Button 
              onClick={() => goToStep(currentStep)}
              className="bg-primary text-primary-foreground"
            >
              {t(step.actionKey)}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              {t("onboarding.stepOf")
                .replace("{current}", String(currentStep + 1))
                .replace("{total}", String(steps.length))}
            </p>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-muted-foreground"
            >
              {t("onboarding.skipTour")}
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  {isRTL ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={nextStep}>
                {isLastStep ? t("onboarding.finishTour") : t("onboarding.nextStep")}
                {!isLastStep && (
                  isRTL ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
