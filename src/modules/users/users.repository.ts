import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        email: string,
        pwdHash: string,
    ) {
        const user = await this.prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email: email,
                password_hash: pwdHash
            },
            select: {
                id: true,
            }
        });
        return user.id;
    }
    async createRefreshToken(
        userId: string,
        refreshTokenHash: string,
    ) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                refresh_token_hash: refreshTokenHash
            }
        })
    }

    async findUserByEmail(
        email: string,
    ) {
        return this.prisma.user.findUnique({
            where: { email: email },
        })
    }

    async findUserById(
        id: string,
    ) {
        return this.prisma.user.findUnique({
            where: { id: id },
        })
    }

    async deleteRefreshToken(
        userId: string
    ) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refresh_token_hash: null }
        })
    }
    async findManyUsers(
        take: number,
        skip: number
    ) {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            },
            take: take,
            skip: skip,
            orderBy: { id: 'asc' },
        })
    }
    async findOne(
        id: string
    ) {
        return await this.prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            },
            where: { id: id }
        })
    }
    async updateUser(
        userId: string,
        data: {
            name?: string;
            address?: string;
        }
    ) {
        return this.prisma.user.update({
            where: { id: userId },
            data: data,
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        })
    }

    async deleteOne(
        id: string
    ) {
        return this.prisma.user.delete({
            where: { id: id }
        })
    }
}