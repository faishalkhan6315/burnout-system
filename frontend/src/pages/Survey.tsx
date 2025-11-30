import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const Survey = () => {
  const { toast } = useToast();
  const [responses, setResponses] = useState({
    stress_week: [5],
    anxiety_frequency: [5],
    sleep_quality: [5],
    depression_frequency: [5],
    self_esteem: [5],
    physical_fatigue: [5],
    headache_frequency: [5],
    study_load: [5],
    academic_satisfaction: [5],
    career_worry: [5],
    deadline_pressure: [5],
    focus_difficulty: [5],
    social_support: [5],
    peer_pressure: [5],
    teacher_comfort: [5],
    bullying_experience: [5],
    environment_peace: [5],
    class_activity: [5],
    resource_usage: [5],
    hobby_time: [5],
  });

  const questions = [
    {
      id: "stress_week",
      question: "How stressed have you felt this week?",
      lowLabel: "Not at all",
      highLabel: "Extremely",
    },
    {
      id: "anxiety_frequency",
      question: "How often do you feel anxious or nervous?",
      lowLabel: "Never",
      highLabel: "Always",
    },
    {
      id: "sleep_quality",
      question: "How would you rate your sleep quality?",
      lowLabel: "Very poor",
      highLabel: "Excellent",
    },
    {
      id: "depression_frequency",
      question: "How often do you feel down or depressed?",
      lowLabel: "Never",
      highLabel: "Always",
    },
    {
      id: "self_esteem",
      question: "How satisfied are you with yourself? (Self-Esteem)",
      lowLabel: "Not at all",
      highLabel: "Very satisfied",
    },
    {
      id: "physical_fatigue",
      question: "How physically tired do you feel right now?",
      lowLabel: "Not tired",
      highLabel: "Exhausted",
    },
    {
      id: "headache_frequency",
      question: "How often do you get headaches?",
      lowLabel: "Never",
      highLabel: "Often",
    },
    {
      id: "study_load",
      question: "How heavy is your study load right now?",
      lowLabel: "Light",
      highLabel: "Very heavy",
    },
    {
      id: "academic_satisfaction",
      question: "How satisfied are you with your grades/GPA?",
      lowLabel: "Dissatisfied",
      highLabel: "Satisfied",
    },
    {
      id: "career_worry",
      question: "How worried are you about your future career?",
      lowLabel: "Not worried",
      highLabel: "Very worried",
    },
    {
      id: "deadline_pressure",
      question: "How much pressure do you feel from deadlines?",
      lowLabel: "None",
      highLabel: "Extreme",
    },
    {
      id: "focus_difficulty",
      question: "How hard is it for you to focus in class?",
      lowLabel: "Easy",
      highLabel: "Very hard",
    },
    {
      id: "social_support",
      question: "Do you feel supported by family and friends?",
      lowLabel: "Not supported",
      highLabel: "Very supported",
    },
    {
      id: "peer_pressure",
      question: "How much peer pressure do you feel?",
      lowLabel: "None",
      highLabel: "A lot",
    },
    {
      id: "teacher_comfort",
      question: "How comfortable are you with your teachers?",
      lowLabel: "Uncomfortable",
      highLabel: "Very comfortable",
    },
    {
      id: "bullying_experience",
      question: "Have you experienced bullying recently?",
      lowLabel: "Never",
      highLabel: "Frequently",
    },
    {
      id: "environment_peace",
      question: "How peaceful is your living/study environment?",
      lowLabel: "Chaotic",
      highLabel: "Very peaceful",
    },
    {
      id: "class_activity",
      question: "How active are you in class discussions?",
      lowLabel: "Passive",
      highLabel: "Very active",
    },
    {
      id: "resource_usage",
      question: "How often do you check course resources online?",
      lowLabel: "Never",
      highLabel: "Daily",
    },
    {
      id: "hobby_time",
      question: "How much time do you spend on hobbies/sports?",
      lowLabel: "None",
      highLabel: "A lot",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...responses,
          user_id: "STU_123",
          user_name: "Demo User"
        }),
      });

      if (response.ok) {
        toast({
          title: "Check-in submitted!",
          description: "Your responses help us provide better predictions and support.",
        });
      } else {
        throw new Error('Failed to submit survey');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error saving your responses. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSliderChange = (id: string, value: number[]) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quick Stress Check-In</h1>
          <p className="text-muted-foreground text-lg">
            Answer these 5 quick questions to help us understand how you're feeling
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-8 shadow-soft mb-6">
            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {idx + 1}
                    </span>
                    <Label className="text-lg font-medium pt-1">{q.question}</Label>
                  </div>

                  <div className="pl-11 space-y-3">
                    <Slider
                      value={responses[q.id as keyof typeof responses]}
                      onValueChange={(value) => handleSliderChange(q.id, value)}
                      max={10}
                      min={1}
                      step={1}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{q.lowLabel}</span>
                      <span className="font-semibold text-foreground">
                        {responses[q.id as keyof typeof responses][0]}/10
                      </span>
                      <span>{q.highLabel}</span>
                    </div>
                  </div>

                  {idx < questions.length - 1 && <div className="border-t border-border mt-6" />}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Takes less than 2 minutes • Completely confidential
            </p>
            <Button type="submit" size="lg" className="gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Submit Check-In
            </Button>
          </div>
        </form>

        <Card className="mt-8 p-6 bg-secondary/20 border-secondary">
          <h3 className="font-semibold mb-2">💡 Why these questions?</h3>
          <p className="text-sm text-muted-foreground">
            These questions help our AI model understand your current wellbeing state.
            Regular check-ins improve prediction accuracy and help identify patterns in your stress levels.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Survey;
