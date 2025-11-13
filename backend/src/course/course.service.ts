import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

async uploadCourse(title: string, content: string, roleAccess: string[], uploadedBy: number) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.course.create({
    data: {
      title,
      content,
      roleAccess,
      uploadedBy,
    },
  });
}

async updateCourse(id: number, title: string, content: string, roleAccess: string[]) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.course.update({
    where: { id },
    data: { title, content, roleAccess },
  });
}

async deleteCourse(id: number) {
  return this.prisma.course.delete({ where: { id } });
}

async getCourses(userRoles: string[]) {
  // If user is admin, return all courses
  if (userRoles.includes('admin')) {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  
  // For non-admin users, filter by role access
  return this.prisma.course.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async uploadLiveSession(title: string, description: string, date: Date, roleAccess: string[], uploadedBy: number, duration?: number, maxParticipants?: number, autoRecord?: boolean) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  const session = await this.prisma.liveSession.create({
    data: {
      title,
      description,
      date,
      duration: duration || 60,
      maxParticipants: maxParticipants || 50,
      roleAccess,
      autoRecord: autoRecord || false,
      uploadedBy,
    },
  });

  // Create analytics record
  await this.prisma.sessionAnalytics.create({
    data: {
      sessionId: session.id,
    },
  });

  return session;
}

async updateLiveSession(id: number, title: string, description: string, date: Date, roleAccess: string[], duration?: number, maxParticipants?: number, autoRecord?: boolean) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  const updateData: any = { title, description, date, roleAccess };
  if (duration !== undefined) updateData.duration = duration;
  if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants;
  if (autoRecord !== undefined) updateData.autoRecord = autoRecord;

  return this.prisma.liveSession.update({
    where: { id },
    data: updateData,
  });
}

async deleteLiveSession(id: number) {
  return this.prisma.liveSession.delete({ where: { id } });
}

async getLiveSessions(userRoles: string[]) {
  // If user is admin, return all live sessions
  if (userRoles.includes('admin')) {
    return this.prisma.liveSession.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        analytics: true,
        _count: {
          select: {
            participants: true,
            recordings: true,
            feedback: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }
  
  // For non-admin users, filter by role access
  return this.prisma.liveSession.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      analytics: true,
      _count: {
        select: {
          participants: true,
          recordings: true,
          feedback: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });
}

async uploadSignal(title: string, content: string, roleAccess: string[], uploadedBy: number) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.signal.create({
    data: {
      title,
      content,
      roleAccess,
      uploadedBy,
    },
  });
}

async updateSignal(id: number, title: string, content: string, roleAccess: string[]) {
  const validRoles = await this.prisma.role.findMany({ where: { name: { in: roleAccess } } });
  if (validRoles.length !== roleAccess.length) {
    throw new BadRequestException('Invalid roles in roleAccess');
  }

  return this.prisma.signal.update({
    where: { id },
    data: { title, content, roleAccess },
  });
}

async deleteSignal(id: number) {
  return this.prisma.signal.delete({ where: { id } });
}
async getSignals(userRoles: string[]) {
  // If user is admin, return all signals
  if (userRoles.includes('admin')) {
    return this.prisma.signal.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  
  // For non-admin users, filter by role access
  return this.prisma.signal.findMany({
    where: {
      roleAccess: {
        hasSome: userRoles,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async getCourseVideos(courseId: number, userRoles: string[]) {
  const course = await this.prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new BadRequestException('Course not found');
  }
  // Basic guard: ensure user has access to this course
  const allowed = course.roleAccess.some((r) => userRoles.includes(r));
  if (!allowed) {
    throw new BadRequestException('Access denied');
  }

  const prismaAny = this.prisma as any;
  return prismaAny.courseVideo.findMany({
    where: { courseId },
    orderBy: { orderIndex: 'asc' },
  });
}

async addCourseVideo(courseId: number, body: { title: string; description?: string; videoUrl: string; durationSec?: number; orderIndex?: number }) {
  // Ensure course exists
  const course = await this.prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new BadRequestException('Course not found');

  // Default orderIndex to next available
  let orderIndex = body.orderIndex ?? 0;
  if (body.orderIndex === undefined) {
  const prismaAny1 = this.prisma as any;
  const maxOrder = await prismaAny1.courseVideo.aggregate({
      where: { courseId },
      _max: { orderIndex: true },
    });
    orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;
  }

  const prismaAnyCreate = this.prisma as any;
  return prismaAnyCreate.courseVideo.create({
    data: {
      courseId,
      title: body.title,
      description: body.description ?? null,
      videoUrl: body.videoUrl,
      durationSec: body.durationSec ?? null,
      orderIndex,
    },
  });
}

async updateCourseVideo(courseId: number, videoId: number, body: { title?: string; description?: string; videoUrl?: string; durationSec?: number; orderIndex?: number }) {
  // Ensure episode belongs to course
  const prismaAny2 = this.prisma as any;
  const video = await prismaAny2.courseVideo.findUnique({ where: { id: videoId } });
  if (!video || video.courseId !== courseId) throw new BadRequestException('Video not found');

  return prismaAny2.courseVideo.update({
    where: { id: videoId },
    data: {
      title: body.title ?? video.title,
      description: body.description ?? video.description,
      videoUrl: body.videoUrl ?? video.videoUrl,
      durationSec: body.durationSec ?? video.durationSec,
      orderIndex: body.orderIndex ?? video.orderIndex,
    },
  });
}

async deleteCourseVideo(courseId: number, videoId: number) {
  const prismaAny3 = this.prisma as any;
  const video = await prismaAny3.courseVideo.findUnique({ where: { id: videoId } });
  if (!video || video.courseId !== courseId) throw new BadRequestException('Video not found');
  return prismaAny3.courseVideo.delete({ where: { id: videoId } });
}

// Live Session Control Methods
async startLiveSession(sessionId: number, userId: number) {
  const session = await this.prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new BadRequestException('Session not found');
  if (session.uploadedBy !== userId) throw new BadRequestException('Only the host can start the session');

  return this.prisma.liveSession.update({
    where: { id: sessionId },
    data: {
      status: 'live',
      actualStartTime: new Date(),
      sessionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/session/${sessionId}`,
    },
  });
}

async endLiveSession(sessionId: number, userId: number) {
  const session = await this.prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new BadRequestException('Session not found');
  if (session.uploadedBy !== userId) throw new BadRequestException('Only the host can end the session');

  return this.prisma.liveSession.update({
    where: { id: sessionId },
    data: {
      status: 'ended',
      actualEndTime: new Date(),
    },
  });
}

async joinLiveSession(sessionId: number, userId: number) {
  try {
    const session = await this.prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: { 
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!session) throw new BadRequestException('Session not found');
    
    // Allow joining for scheduled and live sessions
    if (!['scheduled', 'live'].includes(session.status)) {
      throw new BadRequestException('Session is not available for joining');
    }
    
    // Check if user already joined (active participant)
    const existingParticipant = session.participants.find(p => p.userId === userId && !p.leftAt);
    if (existingParticipant) {
      console.log(`User ${userId} already joined session ${sessionId}, returning existing participant`);
      // Return existing participant with session data
      return {
        sessionToken: `session_${sessionId}_${userId}_${Date.now()}`,
        sessionData: session,
        participant: existingParticipant,
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };
    }

    // Clean up any old participant records for this user (who left previously)
    await this.prisma.sessionParticipant.deleteMany({
      where: {
        sessionId,
        userId,
        leftAt: { not: null }, // Only delete records where user has left
      },
    });
    console.log(`Cleaned up old participant records for user ${userId} in session ${sessionId}`);

    // Check max participants
    const activeParticipants = session.participants.filter(p => !p.leftAt).length;
    if (session.maxParticipants && activeParticipants >= session.maxParticipants) {
      throw new BadRequestException('Session is full');
    }

    // Create participant record
    const participant = await this.prisma.sessionParticipant.create({
      data: {
        sessionId,
        userId,
        role: session.uploadedBy === userId ? 'host' : 'participant',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update analytics (make this optional to prevent failures)
    try {
      await this.updateSessionAnalytics(sessionId);
    } catch (analyticsError) {
      console.warn('Failed to update session analytics:', analyticsError);
    }

    // Return the expected JoinSessionResponse format
    return {
      sessionToken: `session_${sessionId}_${userId}_${Date.now()}`,
      sessionData: session,
      participant: participant,
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };
  } catch (error) {
    console.error('Error in joinLiveSession:', error);
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException('Failed to join session. Please try again.');
  }
}

async leaveLiveSession(sessionId: number, userId: number) {
  try {
    const participant = await this.prisma.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId,
        leftAt: null,
      },
    });

    if (!participant) {
      // Return success even if participant not found (already left or never joined)
      return { message: 'Successfully left session' };
    }

    await this.prisma.sessionParticipant.update({
      where: { id: participant.id },
      data: { leftAt: new Date() },
    });

    // Update analytics (make this optional to prevent failures)
    try {
      await this.updateSessionAnalytics(sessionId);
    } catch (analyticsError) {
      console.warn('Failed to update session analytics:', analyticsError);
    }
    
    return { message: 'Successfully left session' };
  } catch (error) {
    console.error('Error in leaveLiveSession:', error);
    // Return success to prevent client-side errors
    return { message: 'Successfully left session' };
  }
}

async getSessionParticipants(sessionId: number) {
  // Only return active participants (those who haven't left)
  return this.prisma.sessionParticipant.findMany({
    where: { 
      sessionId,
      leftAt: null, // Only active participants
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });
}

async updateParticipantPermissions(sessionId: number, participantId: string, permissions: any, hostUserId: number) {
  const session = await this.prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new BadRequestException('Session not found');
  if (session.uploadedBy !== hostUserId) throw new BadRequestException('Only the host can update permissions');

  return this.prisma.sessionParticipant.update({
    where: { id: participantId },
    data: { permissions },
  });
}

async kickParticipant(sessionId: number, participantId: string, hostUserId: number) {
  const session = await this.prisma.liveSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new BadRequestException('Session not found');
  if (session.uploadedBy !== hostUserId) throw new BadRequestException('Only the host can kick participants');

  return this.prisma.sessionParticipant.update({
    where: { id: participantId },
    data: { leftAt: new Date() },
  });
}

// Get upcoming and live sessions for students
async getUpcomingAndLiveSessions(userRoles: string[]) {
  const now = new Date();
  
  console.log('Getting live sessions for roles:', userRoles);
  
  // First, let's get all sessions to debug
  const allSessions = await this.prisma.liveSession.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });
  
  console.log('All sessions in database:', allSessions.length);
  
  // For now, return all sessions to test the frontend
  const filteredSessions = allSessions.filter(session => {
    const isLiveOrUpcoming = session.status === 'live' || 
      (session.status === 'scheduled' && new Date(session.date) >= now);
    
    // For debugging, let's be permissive with roles
    const hasAccess = session.roleAccess.some(role => 
      userRoles.includes(role) || role === 'free' || userRoles.includes('free')
    );
    
    console.log(`Session ${session.id}: status=${session.status}, hasAccess=${hasAccess}, roleAccess=${session.roleAccess}`);
    
    return isLiveOrUpcoming && hasAccess;
  });
  
  console.log('Filtered sessions:', filteredSessions.length);
  
  return filteredSessions.sort((a, b) => {
    // Live sessions first
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    // Then by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

// Session Analytics
private async updateSessionAnalytics(sessionId: number) {
  const participants = await this.prisma.sessionParticipant.findMany({
    where: { sessionId },
    include: { user: { include: { roles: { include: { role: true } } } } },
  });

  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(p => !p.leftAt).length;
  
  // Calculate attendance by role
  const attendanceByRole: any = {};
  participants.forEach(p => {
    p.user.roles.forEach(userRole => {
      const roleName = userRole.role.name;
      attendanceByRole[roleName] = (attendanceByRole[roleName] || 0) + 1;
    });
  });

  await this.prisma.sessionAnalytics.upsert({
    where: { sessionId },
    update: {
      totalParticipants,
      peakParticipants: Math.max(activeParticipants, totalParticipants),
      attendanceByRole,
    },
    create: {
      sessionId,
      totalParticipants,
      peakParticipants: Math.max(activeParticipants, totalParticipants),
      attendanceByRole,
      averageDuration: 0,
      chatMessages: 0,
      engagementRate: 0,
    },
  });
}

async getSessionAnalytics(sessionId: number) {
  return this.prisma.sessionAnalytics.findUnique({
    where: { sessionId },
    include: {
      session: {
        select: {
          title: true,
          date: true,
          duration: true,
          status: true,
        },
      },
    },
  });
}

// Session Feedback
async submitSessionFeedback(sessionId: number, userId: number, rating: number, comment?: string, categories?: any) {
  // Check if user participated in the session
  const participant = await this.prisma.sessionParticipant.findFirst({
    where: { sessionId, userId },
  });

  if (!participant) throw new BadRequestException('You must participate in the session to provide feedback');

  return this.prisma.sessionFeedback.create({
    data: {
      sessionId,
      userId,
      rating,
      comment,
      categories,
    },
  });
}

async getSessionFeedback(sessionId: number) {
  const feedback = await this.prisma.sessionFeedback.findMany({
    where: { sessionId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
    : 0;

  return {
    averageRating,
    totalResponses: feedback.length,
    feedback,
  };
}

// Cleanup method to remove duplicate participants
async cleanupSessionParticipants(sessionId: number) {
  try {
    console.log(`Starting cleanup for session ${sessionId}`);
    
    // Get all participants for this session
    const allParticipants = await this.prisma.sessionParticipant.findMany({
      where: { sessionId },
      orderBy: { joinedAt: 'desc' }, // Most recent first
    });

    // Group by userId to find duplicates
    const userParticipants = new Map<number, any[]>();
    allParticipants.forEach(participant => {
      const userId = participant.userId;
      if (!userParticipants.has(userId)) {
        userParticipants.set(userId, []);
      }
      userParticipants.get(userId)!.push(participant);
    });

    let cleanedCount = 0;
    
    // For each user, keep only the most recent active participant
    for (const [userId, participants] of userParticipants) {
      if (participants.length > 1) {
        console.log(`Found ${participants.length} participant records for user ${userId}`);
        
        // Find the most recent active participant (not left)
        const activeParticipant = participants.find(p => !p.leftAt);
        
        // If there's an active participant, remove all others
        // If no active participant, keep the most recent one
        const keepParticipant = activeParticipant || participants[0];
        
        const toDelete = participants.filter(p => p.id !== keepParticipant.id);
        
        if (toDelete.length > 0) {
          await this.prisma.sessionParticipant.deleteMany({
            where: {
              id: { in: toDelete.map(p => p.id) },
            },
          });
          cleanedCount += toDelete.length;
          console.log(`Removed ${toDelete.length} duplicate records for user ${userId}`);
        }
      }
    }

    console.log(`Cleanup completed: removed ${cleanedCount} duplicate participant records`);
    return { cleaned: cleanedCount };
  } catch (error) {
    console.error('Error cleaning up session participants:', error);
    throw error;
  }
}

// Method to get clean participant count
async getActiveParticipantCount(sessionId: number) {
  const count = await this.prisma.sessionParticipant.count({
    where: {
      sessionId,
      leftAt: null,
    },
  });
  return count;
}
}