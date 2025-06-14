-- CreateEnum
CREATE TYPE "LeaderShipLevel" AS ENUM ('PASTOR', 'MINISTER', 'HOD', 'ASSISTANT_HOD', 'EXECUTIVE_ASSISTANT', 'WORKER', 'MEMBER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "UserPostgres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "UserPostgres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "profile_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "giving_number" TEXT NOT NULL,
    "leadership_level" "LeaderShipLevel" NOT NULL,
    "lifeclass_topic" INTEGER NOT NULL,
    "lifeclass_teacher_profile_id" TEXT NOT NULL,
    "mentor_profile_id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "phone_contact" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "departments" TEXT[],
    "centrals" TEXT[],
    "registered_from" TEXT,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "Installations" (
    "installation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" JSONB NOT NULL,
    "finance_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Installations_pkey" PRIMARY KEY ("installation_id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "department_id" TEXT NOT NULL,
    "department_type" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "finance_id" TEXT NOT NULL,
    "members" JSONB NOT NULL,
    "dues_paid_per_individual" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "installation_id" TEXT NOT NULL,
    "centrals" TEXT[],

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "Centrals" (
    "central_id" TEXT NOT NULL,
    "central_name" TEXT NOT NULL,
    "finance_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "departments" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Centrals_pkey" PRIMARY KEY ("central_id")
);

-- CreateTable
CREATE TABLE "DepartmentClass" (
    "department_class_id" TEXT NOT NULL,
    "department_class_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentClass_pkey" PRIMARY KEY ("department_class_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPostgres_email_key" ON "UserPostgres"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_email_key" ON "Profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_giving_number_key" ON "Profiles"("giving_number");

-- CreateIndex
CREATE UNIQUE INDEX "Installations_name_key" ON "Installations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Installations_finance_id_key" ON "Installations"("finance_id");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_department_name_key" ON "Departments"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_finance_id_key" ON "Departments"("finance_id");

-- CreateIndex
CREATE UNIQUE INDEX "Centrals_central_name_key" ON "Centrals"("central_name");

-- CreateIndex
CREATE UNIQUE INDEX "Centrals_finance_id_key" ON "Centrals"("finance_id");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentClass_department_class_name_key" ON "DepartmentClass"("department_class_name");
