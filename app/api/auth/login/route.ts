import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Mock database - matches the existing login system
let users = [
  {
    id: 1,
    name: "Lora Azuwesi",
    email: "lora.azuwesi@gmail.com",
    password: "password123", // In production, this would be hashed
    country: "Bangladesh",
    phone: "+880 1712 345 678",
    city: "Dhaka, Bangladesh",
    memberSince: "Member since Oct 2023",
    role: "STUDENT",
    avatar: "/assets/student.jpg",
    stats: {
      enrolledCourses: 203,
      certificates: 15,
      points: 480,
      hoursStudied: 120,
      completedCourses: 4
    },
    createdAt: "2023-10-15T00:00:00Z",
    updatedAt: new Date().toISOString(),
    isActive: true,
    lastLogin: null
  },
  {
    id: 2,
    name: "Rajib Kumar",
    email: "rajib.kumar@gmail.com",
    password: "password123",
    country: "India",
    phone: "+91 9876543210",
    city: "Mumbai, India",
    memberSince: "Member since Sep 2023",
    role: "MENTOR",
    avatar: "/assets/mentor.jpg",
    stats: {
      enrolledCourses: 0,
      certificates: 25,
      points: 1200,
      hoursStudied: 300,
      completedCourses: 12
    },
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: new Date().toISOString(),
    isActive: true,
    lastLogin: null
  },
  {
    id: 3,
    name: "John Smiga",
    email: "john.smiga@gmail.com",
    password: "password123",
    country: "United States",
    phone: "+1 555 123 4567",
    city: "New York, NY",
    memberSince: "Member since Aug 2023",
    role: "INSTRUCTOR",
    avatar: "/assets/instructor.jpg",
    stats: {
      enrolledCourses: 0,
      certificates: 35,
      points: 2500,
      hoursStudied: 500,
      completedCourses: 20
    },
    createdAt: "2023-08-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
    isActive: true,
    lastLogin: null
  }
];

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Simple password comparison for demo
    // In production, use bcrypt.compare(password, user.hashedPassword)
    if (password !== user.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].lastLogin = new Date().toISOString();

    // Return user data (excluding password)
    const { password: _, ...safeUser } = user;
    
    return NextResponse.json({
      success: true,
      data: {
        ...safeUser,
        lastLogin: users[userIndex].lastLogin
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}