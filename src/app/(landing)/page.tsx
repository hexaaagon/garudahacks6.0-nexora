"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Users,
  Zap,
  CheckCircle,
  Star,
  Clock,
  Target,
  Sparkles,
  PlayCircle,
  TrendingUp,
  Shield,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Hero Section with Enhanced Animations */}
      <section
        ref={heroRef}
        className="relative py-32 px-4 overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/30 to-purple-100/30 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <div
          className={`relative container mx-auto text-center max-w-5xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300 hover:scale-105">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            New AI Platform - 100% FREE
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight">
            Transform Your Classroom with{" "}
            <span className="bg-gradient-to-r from-primary via-red-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              AI-Driven
            </span>{" "}
            Learning
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto">
            Stop struggling with 40+ students in one class. Claisse helps
            Indonesian teachers create{" "}
            <span className="font-semibold text-primary">
              personalized learning experiences
            </span>{" "}
            using AI - just share your subject matter, and we&apos;ll generate
            customized essays and quizzes for each student.{" "}
            <span className="font-bold text-green-600">Completely free!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/auth/sign-in">
                Start Teaching Smarter - FREE!
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-border text-foreground px-10 py-6 text-xl bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <PlayCircle className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform text-primary" />
              Watch Demo
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            <Image
              src="https://picsum.photos/1920/1080"
              alt="Teachers using Claisse - Free AI platform by Nexora team"
              width={1000}
              height={600}
              className="relative rounded-3xl shadow-2xl mx-auto border border-border group-hover:scale-105 transition-all duration-700 hover:shadow-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>
          </div>
        </div>
      </section>

      {/* Problem Section - Enhanced */}
      <section className="py-32 bg-gradient-to-b from-accent/20 to-background px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-destructive/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
              <Clock className="w-4 h-4 mr-2" />
              Current Challenges
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">
              The Reality of Teaching in{" "}
              <span className="text-destructive">Indonesia</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We understand the challenges you face every day in the classroom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Users,
                title: "Overcrowded Classes",
                description:
                  "Managing 40+ students in one classroom makes personalized attention nearly impossible",
                color: "destructive",
                colorHex: "#ef4444", // red-500
                delay: "0",
              },
              {
                icon: Clock,
                title: "Time Constraints",
                description:
                  "Creating individual assignments and assessments for each student is time-consuming",
                color: "yellow-500",
                colorHex: "#f59e42", // yellow-500
                delay: "200",
              },
              {
                icon: Target,
                title: "Unequal Attention",
                description:
                  "Naturally focusing on high-performing students while others fall behind",
                color: "blue-500",
                colorHex: "#3b82f6", // blue-500
                delay: "400",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className={`group border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-card backdrop-blur-sm animate-fade-in-up`}
                style={{ animationDelay: `${item.delay}ms` }}
              >
                <CardHeader className="text-center pb-6">
                  <div
                    className="w-20 h-20 rounded--2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor:
                        item.color === "destructive"
                          ? "rgba(239,68,68,0.1)"
                          : item.color === "yellow-500"
                          ? "rgba(245,158,66,0.1)"
                          : item.color === "blue-500"
                          ? "rgba(59,130,246,0.1)"
                          : undefined,
                    }}
                  >
                    <item.icon
                      className="w-10 h-10"
                      style={{
                        color:
                          item.color === "destructive"
                            ? "#ef4444"
                            : item.color === "yellow-500"
                            ? "#f59e42"
                            : item.color === "blue-500"
                            ? "#3b82f6"
                            : undefined,
                      }}
                    />
                  </div>
                  <CardTitle className="text-2xl text-card-foreground group-hover:text-muted-foreground transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-background to-accent/10"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Our Solution - 100% Free
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Meet Claisse: Your{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI Teaching Assistant
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Like Google Classroom, but smarter and{" "}
              <span className="font-bold text-green-600">completely free</span>.
              Powered by AI to create personalized learning experiences for
              every student.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {[
                {
                  icon: Brain,
                  title: "AI-Generated Content",
                  description:
                    "Simply input 1-5 paragraphs of subject matter, and our AI creates personalized essays and multiple-choice questions for each student.",
                  color: "primary",
                  colorHex: "#ff6600",
                },
                {
                  icon: Users,
                  title: "Personalized Learning",
                  description:
                    "Content adapts to each student's grade level, learning style, and personality for maximum engagement.",
                  color: "blue-500",
                  colorHex: "#3b82f6",
                },
                {
                  icon: Zap,
                  title: "Instant Deployment",
                  description:
                    "Distribute customized learning materials to all students simultaneously through our online platform.",
                  color: "purple-500",
                  colorHex: "#a855f7",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-card/60 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-lg border border-transparent hover:border-border"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor:
                        feature.color === "primary"
                          ? "rgba(255,102,0,0.1)"
                          : feature.colorHex + "1A",
                    }}
                  >
                    <feature.icon
                      className="w-8 h-8"
                      style={{
                        color:
                          feature.color === "primary"
                            ? "#ff6600"
                            : feature.colorHex,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-muted-foreground transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
              <Image
                src="https://picsum.photos/600/800"
                alt="Claisse AI Dashboard - Free for all Indonesian teachers"
                width={600}
                height={800}
                className="relative rounded-3xl shadow-2xl border border-border group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-3xl"></div>

              {/* Free Badge on Image */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white border-0 shadow-lg">
                  FREE FOREVER
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Interactive */}
      <section
        id="how-it-works"
        className="py-32 bg-gradient-to-b from-gray-50 to-white px-4 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
              <Layers className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              How Claisse{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Three simple steps to transform your teaching
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Upload Subject Matter",
                description:
                  "Share 1-5 paragraphs of your lesson content. That's all you need to get started.",
                color: "from-orange-500 to-red-500",
                delay: "0",
              },
              {
                step: "2",
                title: "AI Creates Content",
                description:
                  "Our AI analyzes student profiles and generates personalized essays and quizzes for each learner.",
                color: "from-blue-500 to-indigo-500",
                delay: "200",
              },
              {
                step: "3",
                title: "Deploy & Track",
                description:
                  "Instantly distribute materials to students and track their progress in real-time.",
                color: "from-purple-500 to-pink-500",
                delay: "400",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative text-center group animate-fade-in-up hover:scale-105 transition-all duration-500`}
                style={{ animationDelay: `${item.delay}ms` }}
              >
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                  </div>
                )}

                <div
                  className={`relative w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 z-10`}
                >
                  <span className="text-3xl font-bold text-white">
                    {item.step}
                  </span>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-gray-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Demo CTA */}
          <div className="text-center mt-16">
            <Link href="/">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PlayCircle className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                See It In Action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-accent/10 to-background"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Layers className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">
              How{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Claisse Works
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Get started in just 3 simple steps and transform your teaching
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload Your Content",
                description:
                  "Simply paste 1-5 paragraphs of your subject matter. Our AI will analyze and understand the key concepts.",
                icon: BookOpen,
                color: "primary",
              },
              {
                step: "02",
                title: "AI Generates Questions",
                description:
                  "Our advanced AI creates personalized multiple-choice questions and essays tailored to each student's learning style.",
                icon: Brain,
                color: "purple-500",
              },
              {
                step: "03",
                title: "Students Learn & Grow",
                description:
                  "Students receive customized assignments that adapt to their personality and learning preferences, improving engagement.",
                icon: TrendingUp,
                color: "green-500",
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl blur-xl group-hover:blur-lg transition-all duration-500"></div>
                <Card className="relative border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm p-8">
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="text-6xl font-bold text-muted-foreground/20 absolute -top-4 left-1/2 transform -translate-x-1/2">
                        {item.step}
                      </div>
                      <div
                        className={`w-20 h-20 bg-${
                          item.color === "primary" ? "primary" : item.color
                        }/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}
                      >
                        <item.icon
                          className={`w-10 h-10 text-${
                            item.color === "primary" ? "primary" : item.color
                          }`}
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Enhanced Stats */}
      <section
        id="benefits"
        className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-background to-accent/10"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-green-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-green-100/80 text-green-800 border-green-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Key Benefits
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Why Teachers Choose{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Claisse
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Experience the power of AI-driven personalized education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Save Time",
                description:
                  "Reduce content creation time by 90% with AI-generated questions",
                color: "green",
                delay: "0",
              },
              {
                icon: Star,
                title: "Boost Engagement",
                description:
                  "Personalized content increases student participation by 87%",
                color: "blue",
                delay: "100",
              },
              {
                icon: Target,
                title: "Personalized Learning",
                description:
                  "Every student gets content tailored to their learning style",
                color: "purple",
                delay: "200",
              },
              {
                icon: Shield,
                title: "Always Free",
                description:
                  "100% free forever - no hidden costs or subscriptions",
                color: "orange",
                delay: "300",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className={`group border-0 shadow-lg hover:shadow-2xl text-center p-8 transition-all duration-500 hover:scale-105 bg-card/80 backdrop-blur-sm animate-fade-in-up`}
                style={{ animationDelay: `${benefit.delay}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-${benefit.color}-100/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon
                    className={`w-8 h-8 text-${benefit.color}-600`}
                  />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Additional Benefits Grid */}
          <div className="mt-20 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground mb-8">
                For Teachers
              </h3>
              {[
                "Create personalized assignments in minutes",
                "Automatically generate diverse question types",
                "Track student progress with AI insights",
                "Focus on teaching, not content creation",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground mb-8">
                For Students
              </h3>
              {[
                "Receive content matched to learning style",
                "Engage with personalized questions",
                "Build confidence through adaptive learning",
                "Learn at your own pace and preference",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-muted-foreground text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-40 px-4 relative overflow-hidden bg-gradient-to-br from-primary via-red-500 to-purple-600">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto max-w-5xl text-center">
          <Badge className="mb-8 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Shield className="w-4 h-4 mr-2" />
            100% Free Forever - No Hidden Costs
          </Badge>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Teaching?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join thousands of Indonesian teachers using Claisse -{" "}
            <span className="font-bold text-green-300">completely free</span>{" "}
            and built with ❤️ by the{" "}
            <span className="font-bold text-yellow-300">Nexora team</span> for
            Garuda Hacks 6.0.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/auth/sign-in">
              <Button
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Teaching Smarter - FREE!
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-border text-foreground px-10 py-6 text-xl bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <PlayCircle className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform text-primary" />
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/80 max-w-2xl mx-auto">
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 mb-2 text-green-300" />
            <span className="font-semibold">Always Free</span>
            <span className="text-sm">No subscription needed</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 mb-2 text-green-300" />
            <span className="font-semibold">Open Source</span>
            <span className="text-sm">Built by Nexora team</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 mb-2 text-green-300" />
            <span className="font-semibold">Community Driven</span>
            <span className="text-sm">Open-Source Hackathon project</span>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t border-border text-foreground py-20 px-4 relative bottom-0 inset-x-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-3xl font-bold">Claisse</span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                <span className="font-semibold text-green-600">100% Free</span>{" "}
                AI-powered education platform built with ❤️ by the{" "}
                <span className="font-bold text-primary">Nexora team</span> for
                Garuda Hacks 6.0.
              </p>
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-accent hover:bg-accent/80 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <div className="w-5 h-5 bg-muted-foreground rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Support",
                links: [
                  {
                    text: "Contact Us",
                    href: "mailto:nexoracontact@gmail.com",
                  },
                  {
                    text: "GitHub",
                    href: "https://github.com/hexaaagon/claiss",
                  },
                ],
              },
              {
                title: "Team",
                links: [
                  { text: "Garuda Hack", href: "https://garudahacks.com" },
                  {
                    text: "Open Source",
                    href: "https://github.com/hexaaagon/claiss",
                  },
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg mb-6 text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {typeof link === "string" ? (
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-primary transition-colors duration-200 text-base"
                        >
                          {link}
                        </Link>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-200 text-base"
                          target={
                            link.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            link.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {link.text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-base">
                &copy; 2025 Claisse by Nexora Team. Open source and free
                forever. <br /> Made with ❤️ for Indonesian educators at Garuda
                Hacks 6.0.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  MIT License
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
