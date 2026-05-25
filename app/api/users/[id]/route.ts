import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Input validation schemas
const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  country: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  city: z.string().min(2).max(100).optional(),
});

// Mock database - In production, replace with actual database queries
// This simulates users registered through the signup form
let users = [
  {
    id: 1,
    name: "Lora Azuwesi",
    email: "lora.azuwesi@gmail.com",
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
    lastLogin: new Date().toISOString()
  },
  {
    id: 2,
    name: "Rajib Kumar",
    email: "rajib.kumar@gmail.com",
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
    lastLogin: new Date().toISOString()
  },
  {
    id: 3,
    name: "John Smiga",
    email: "john.smiga@gmail.com",
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
    lastLogin: new Date().toISOString()
  }
];

// Security helper functions
function sanitizeInput(input: string): string {
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<[^>]*>/g, '')
              .trim();
}

function validateUserId(id: string): number | null {
  const userId = parseInt(id);
  if (isNaN(userId) || userId <= 0) {
    return null;
  }
  return userId;
}

// GET /api/users/[id] - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = validateUserId(id);
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid user ID format',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    const user = users.find(u => u.id === userId && u.isActive);
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Remove sensitive data before sending
    const { ...safeUser } = user;
    
    return NextResponse.json({
      success: true,
      data: safeUser,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });

  } catch (error) {
    console.error('Error fetching user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      ip: request.ip
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = validateUserId(id);
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid user ID format',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate input using Zod schema
    const validationResult = userUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { name, email, country, phone, city } = validationResult.data;

    // Check if email already exists (if updating email)
    if (email) {
      const existingUser = users.find(u => u.email === email && u.id !== userId && u.isActive);
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email already exists',
            code: 'EMAIL_EXISTS'
          },
          { status: 409 }
        );
      }
    }

    const userIndex = users.findIndex(u => u.id === userId && u.isActive);
    
    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Sanitize and update user data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (name) updateData.name = sanitizeInput(name);
    if (email) updateData.email = email.toLowerCase().trim();
    if (country) updateData.country = sanitizeInput(country);
    if (phone) updateData.phone = phone.trim();
    if (city) updateData.city = sanitizeInput(city);

    users[userIndex] = {
      ...users[userIndex],
      ...updateData
    };

    // Remove sensitive data before sending
    const { ...safeUser } = users[userIndex];

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: safeUser,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    });

  } catch (error) {
    console.error('Error updating user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      ip: request.ip
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}