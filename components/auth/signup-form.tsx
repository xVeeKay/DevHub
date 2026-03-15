"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { SpinnerCustom } from '@/components/ui/spinner'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon,AlertCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [form,setForm]=useState({
        name:"",
        email:"",
        confirmPassword:"",
        password:"",
    })
    type ErrorState = {
        title: string;
        description: string;
        type: "default" | "destructive" | null | undefined;
        show: boolean;
    };
    const [loading,setLoading]=useState(false)
    const [error, setError] = useState<ErrorState>({
        title: "Error",
        description: "Error while signup!",
        type: "default",
        show: false,
    });
    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        setLoading(true)
        if(form.confirmPassword!=form.password){
            setError({
                title:"Incorrect Password",
                description:"Confirm Password and Password are not matched!",
                type:"destructive",
                show:true
            })
            setForm({
                ...form,
                password: "",
                confirmPassword: "",
            });
            setLoading(false)
            return
        }
        const res=await fetch("/api/register",{
            method:"POST",
            body:JSON.stringify(form),
        })
        if(res.ok){
            setError({
                title:"User Created",
                description:"User creation is successfull.",
                type:"default",
                show:true
            })
            setLoading(false)
            router.push("/api/auth/signin")
        }else{
            setLoading(false)
            setError({
                title:"Error",
                description:"User already exists",
                type:"destructive",
                show:true
            })
        }
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        { error.show && (
        <Alert variant={error.type} className="max-w-md">
            {error.type=="default"?<CheckCircle2Icon />:<AlertCircleIcon />}
            <AlertTitle>{error.title}</AlertTitle>
            <AlertDescription>
                {error.description}
            </AlertDescription>
        </Alert>
        )}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required onChange={(e)=>{setForm({...form,name:e.target.value})}}/>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e)=>{setForm({...form,email:e.target.value})}}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required onChange={(e)=>{setForm({...form,password:e.target.value})}}/>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required onChange={(e)=>{setForm({...form,confirmPassword:e.target.value})}}/>
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                    {loading && <SpinnerCustom/>}
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/signin">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
